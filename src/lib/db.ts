import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

interface DBConfig {
  host: string;
  user: string;
  password?: string;
  database: string;
  port?: number;
}

const CONFIG_FILE = path.join(process.cwd(), "src", "constants", "activeDbConfig.json");

// Helper to get saved manual database URL from persistent storage
export function getSavedDatabaseUrl(): string {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      if (data.databaseUrl) return data.databaseUrl;
    }
  } catch (e) {
    // Ignore read errors
  }
  return process.env.DATABASE_URL || "";
}

// Helper to save manual database URL to persistent storage
export function saveDatabaseUrl(url: string) {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ databaseUrl: url }, null, 2), "utf-8");
  } catch (e) {
    // Ignore write errors in read-only serverless environments
  }
}

// Active pool instance reference
let activePool: mysql.Pool | null = null;
let currentDatabaseUrl: string = "";

/**
 * Parses connection string format: mysql://user:password@host:port/database
 */
export function parseDatabaseUrl(url: string): DBConfig | null {
  if (!url || !url.startsWith("mysql://")) return null;

  try {
    const regex = /^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
    const match = url.match(regex);

    if (match) {
      return {
        user: decodeURIComponent(match[1]),
        password: decodeURIComponent(match[2]),
        host: match[3],
        port: parseInt(match[4], 10),
        database: match[5],
      };
    }

    // Fallback regex without port
    const simpleRegex = /^mysql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)$/;
    const simpleMatch = url.match(simpleRegex);
    if (simpleMatch) {
      return {
        user: decodeURIComponent(simpleMatch[1]),
        password: decodeURIComponent(simpleMatch[2]),
        host: simpleMatch[3],
        port: 3306,
        database: simpleMatch[4],
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Gets or creates the MySQL connection pool from DATABASE_URL, manual Admin URL, or environment variables
 */
export function getPool(dbUrlOverride?: string): mysql.Pool | null {
  const urlToUse = dbUrlOverride || currentDatabaseUrl || getSavedDatabaseUrl() || process.env.DATABASE_URL || "";

  if (urlToUse) {
    const config = parseDatabaseUrl(urlToUse);
    if (config) {
      if (!activePool || dbUrlOverride || currentDatabaseUrl) {
        if (activePool) activePool.end().catch(() => {});
        activePool = mysql.createPool({
          host: config.host,
          user: config.user,
          password: config.password,
          database: config.database,
          port: config.port || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 5000,
        });
        currentDatabaseUrl = urlToUse;
      }
      return activePool;
    }
  }

  // Fallback to separate env variables if host & database are provided
  if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE) {
    if (!activePool) {
      activePool = mysql.createPool({
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "doctor_portfolio",
        port: Number(process.env.MYSQL_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000,
      });
    }
    return activePool;
  }

  return null;
}

/**
 * Automatically initializes tables in destination database if missing
 */
export async function autoInitDatabaseTables(pool: mysql.Pool): Promise<{ success: boolean; error?: string }> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`doctor_profile\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`hero_image\` TEXT,
        \`hero_image_public_id\` VARCHAR(255),
        \`about_image\` TEXT,
        \`about_image_public_id\` VARCHAR(255),
        \`qualifications\` TEXT,
        \`experience_years\` INT DEFAULT 16,
        \`patients_treated\` VARCHAR(50) DEFAULT '5,400+',
        \`patient_satisfaction_rate\` FLOAT DEFAULT 98.4,
        \`rating\` FLOAT DEFAULT 4.9,
        \`review_count\` INT DEFAULT 742,
        \`bio\` TEXT,
        \`mission\` TEXT,
        \`vision\` TEXT,
        \`address\` VARCHAR(255),
        \`city\` VARCHAR(100),
        \`state\` VARCHAR(100),
        \`zip\` VARCHAR(20),
        \`google_maps_url\` TEXT,
        \`phone\` VARCHAR(50),
        \`emergency_phone\` VARCHAR(50),
        \`whatsapp_number\` VARCHAR(50),
        \`email\` VARCHAR(100),
        \`working_hours\` TEXT,
        \`socials\` TEXT,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure public_id and whatsapp_number columns exist for metadata tracking
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS hero_image_public_id VARCHAR(255);`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS about_image_public_id VARCHAR(255);`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`short_description\` TEXT,
        \`full_description\` TEXT,
        \`icon_name\` VARCHAR(50) DEFAULT 'ClipboardList',
        \`image\` TEXT,
        \`image_public_id\` VARCHAR(255),
        \`key_benefits\` TEXT,
        \`estimated_duration\` VARCHAR(50) DEFAULT '45-60 mins',
        \`category\` VARCHAR(50) DEFAULT 'clinical'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS image_public_id VARCHAR(255);`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`testimonials\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`patient_name\` VARCHAR(255) NOT NULL,
        \`patient_role_or_condition\` VARCHAR(255),
        \`patient_avatar\` TEXT,
        \`patient_avatar_public_id\` VARCHAR(255),
        \`rating\` INT DEFAULT 5,
        \`review_text\` TEXT NOT NULL,
        \`date\` VARCHAR(50),
        \`verified_google_review\` TINYINT(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS patient_avatar_public_id VARCHAR(255);`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`gallery\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(50) DEFAULT 'clinic',
        \`image\` TEXT NOT NULL,
        \`image_public_id\` VARCHAR(255),
        \`caption\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_public_id VARCHAR(255);`).catch(() => {});

    return { success: true };
  } catch (error) {
    const msg = (error as Error).message;
    console.error("Auto table initialization error:", msg);
    return { success: false, error: msg };
  }
}

/**
 * Runs SQL queries against active database connection
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const pool = getPool();
  if (!pool) return null;

  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.warn("MySQL Database connection query failed, using static fallback dataset:", (error as Error).message);
    return null;
  }
}

export function getCurrentDatabaseUrl(): string {
  return currentDatabaseUrl || getSavedDatabaseUrl() || process.env.DATABASE_URL || "";
}

export function setCurrentDatabaseUrl(url: string) {
  currentDatabaseUrl = url;
  if (url) {
    saveDatabaseUrl(url);
  }
}
