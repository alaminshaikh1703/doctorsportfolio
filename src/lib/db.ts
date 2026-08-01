import mysql from "mysql2/promise";

interface DBConfig {
  host: string;
  user: string;
  password?: string;
  database: string;
  port?: number;
}

// Active pool instance reference
let activePool: mysql.Pool | null = null;
let currentDatabaseUrl: string = process.env.DATABASE_URL || "";

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
 * Gets or creates the MySQL connection pool from DATABASE_URL or environment variables
 */
export function getPool(dbUrlOverride?: string): mysql.Pool | null {
  const urlToUse = dbUrlOverride || currentDatabaseUrl || process.env.DATABASE_URL || "";

  if (urlToUse) {
    const config = parseDatabaseUrl(urlToUse);
    if (config) {
      if (!activePool || dbUrlOverride) {
        if (activePool) activePool.end();
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
        \`hero_image\` LONGTEXT,
        \`about_image\` LONGTEXT,
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
        \`email\` VARCHAR(100),
        \`working_hours\` TEXT,
        \`socials\` TEXT,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure columns support LONGTEXT for full un-truncated Base64 image storage
    await pool.query(`ALTER TABLE doctor_profile MODIFY hero_image LONGTEXT;`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile MODIFY about_image LONGTEXT;`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`services\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`short_description\` TEXT,
        \`full_description\` TEXT,
        \`icon_name\` VARCHAR(50) DEFAULT 'ClipboardList',
        \`image\` LONGTEXT,
        \`key_benefits\` TEXT,
        \`estimated_duration\` VARCHAR(50) DEFAULT '45-60 mins',
        \`category\` VARCHAR(50) DEFAULT 'clinical'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE services MODIFY image LONGTEXT;`).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`testimonials\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`patient_name\` VARCHAR(255) NOT NULL,
        \`patient_role_or_condition\` VARCHAR(255),
        \`patient_avatar\` LONGTEXT,
        \`rating\` INT DEFAULT 5,
        \`review_text\` TEXT NOT NULL,
        \`date\` VARCHAR(50),
        \`verified_google_review\` TINYINT(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`gallery\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(50) DEFAULT 'clinic',
        \`image\` LONGTEXT NOT NULL,
        \`caption\` TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE gallery MODIFY image LONGTEXT;`).catch(() => {});

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
  return currentDatabaseUrl || process.env.DATABASE_URL || "";
}

export function setCurrentDatabaseUrl(url: string) {
  currentDatabaseUrl = url;
}
