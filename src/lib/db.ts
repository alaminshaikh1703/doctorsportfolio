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
      // Only recreate pool if activePool is null or URL has changed
      if (!activePool || (dbUrlOverride && dbUrlOverride !== currentDatabaseUrl) || (currentDatabaseUrl && currentDatabaseUrl !== urlToUse)) {
        if (activePool) {
          try {
            activePool.end().catch(() => {});
          } catch (e) {}
        }
        activePool = mysql.createPool({
          host: config.host,
          user: config.user,
          password: config.password,
          database: config.database,
          port: config.port || 3306,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 10000,
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
        connectTimeout: 10000,
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

    // Ensure public_id, whatsapp_number, and SEO columns exist for metadata tracking
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS hero_image_public_id VARCHAR(255);`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS about_image_public_id VARCHAR(255);`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS seo_title TEXT;`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS seo_description TEXT;`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS seo_keywords TEXT;`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS og_image TEXT;`).catch(() => {});
    await pool.query(`ALTER TABLE doctor_profile ADD COLUMN IF NOT EXISTS og_image_public_id VARCHAR(255);`).catch(() => {});

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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`blog\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255),
        \`category\` VARCHAR(100) DEFAULT 'Dental Health',
        \`read_time\` VARCHAR(50) DEFAULT '5 min read',
        \`date\` VARCHAR(50),
        \`excerpt\` TEXT,
        \`content\` LONGTEXT,
        \`featured_image\` TEXT,
        \`featured_image_public_id\` VARCHAR(255),
        \`author_name\` VARCHAR(255),
        \`author_role\` VARCHAR(255)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE blog ADD COLUMN IF NOT EXISTS featured_image_public_id VARCHAR(255);`).catch(() => {});

    // ========================================================================
    // CLINICAL APPOINTMENT SYSTEM RELATIONAL MIGRATIONS
    // ========================================================================

    // 1. Patients Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`patients\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`full_name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(50) NOT NULL UNIQUE,
        \`email\` VARCHAR(100),
        \`age\` INT NULL,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE patients ADD COLUMN IF NOT EXISTS age INT NULL;`).catch(() => {});

    // 2. Doctors Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`doctors\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`specialization\` VARCHAR(255) NOT NULL,
        \`status\` ENUM('Active', 'Inactive') DEFAULT 'Active',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Clinics Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`clinics\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`doctor_id\` VARCHAR(50) NOT NULL,
        \`clinic_name\` VARCHAR(255) NOT NULL,
        \`address\` TEXT NOT NULL,
        \`phone\` VARCHAR(50),
        \`working_days\` TEXT,
        \`opening_time\` VARCHAR(50) DEFAULT '09:00 AM',
        \`closing_time\` VARCHAR(50) DEFAULT '08:00 PM',
        \`status\` ENUM('Active', 'Inactive') DEFAULT 'Active',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Appointment Slots Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`appointment_slots\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`clinic_id\` VARCHAR(50) NOT NULL,
        \`day_of_week\` VARCHAR(50) NOT NULL,
        \`start_time\` VARCHAR(50) NOT NULL,
        \`end_time\` VARCHAR(50) NOT NULL,
        \`max_capacity\` INT DEFAULT 2,
        \`status\` ENUM('Active', 'Inactive') DEFAULT 'Active',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Appointments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`appointments\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`appointment_number\` VARCHAR(50) NOT NULL UNIQUE,
        \`patient_id\` VARCHAR(50) NOT NULL,
        \`doctor_id\` VARCHAR(50) NOT NULL,
        \`clinic_id\` VARCHAR(50) NOT NULL,
        \`service_id\` VARCHAR(50) NOT NULL,
        \`appointment_date\` DATE NOT NULL,
        \`appointment_slot_id\` VARCHAR(50) NOT NULL,
        \`appointment_time\` VARCHAR(50) NOT NULL,
        \`appointment_type\` ENUM('Regular', 'Emergency') DEFAULT 'Regular',
        \`patient_age\` INT NULL,
        \`visited\` TINYINT(1) DEFAULT 0,
        \`confirmed_at\` DATETIME NULL,
        \`completed_at\` DATETIME NULL,
        \`reason\` TEXT,
        \`status\` ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Pending',
        \`booking_source\` ENUM('Website', 'Website + WhatsApp', 'Admin') DEFAULT 'Website',
        \`admin_note\` TEXT,
        \`is_deleted\` TINYINT(1) DEFAULT 0,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_age INT NULL;`).catch(() => {});

    // 6. Status History Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`appointment_status_history\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`appointment_id\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(50) NOT NULL,
        \`changed_by\` VARCHAR(50) DEFAULT 'Admin',
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // AUTO-SEED DEFAULT DOCTOR IF MISSING
    await pool.query(
      `INSERT IGNORE INTO doctors (id, name, specialization, status) VALUES (?, ?, ?, ?);`,
      ['doc-1', 'Dr. Farzana Khan Mohima', 'Dental Surgeon Specialist (BDS, PGT, MPH)', 'Active']
    ).catch(() => {});

    // AUTO-SEED DEFAULT CLINICS IF MISSING
    await pool.query(
      `INSERT IGNORE INTO clinics (id, doctor_id, clinic_name, address, phone, working_days, opening_time, closing_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        'clinic-1',
        'doc-1',
        "Aveek's Dental and Implant Center(Sat-Thu)",
        'House 42, Road 4, Mohakhali DOHS, Dhaka 1206',
        '+8801531714840',
        JSON.stringify(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']),
        '09:00 AM',
        '08:00 PM',
        'Active'
      ]
    ).catch(() => {});

    await pool.query(
      `INSERT IGNORE INTO clinics (id, doctor_id, clinic_name, address, phone, working_days, opening_time, closing_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        'clinic-2',
        'doc-1',
        'My Dentist & Maxillofacial Surgery(Sat-Thu)',
        'Branch 2, Dhanmondi, Dhaka',
        '+8801531714840',
        JSON.stringify(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']),
        '04:00 PM',
        '09:00 PM',
        'Active'
      ]
    ).catch(() => {});

    // AUTO-SEED DEFAULT APPOINTMENT SLOTS FOR CLINICS IF MISSING
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const defaultSlots = [
      { start: '09:00 AM', end: '09:30 AM' },
      { start: '10:30 AM', end: '11:00 AM' },
      { start: '02:00 PM', end: '02:30 PM' },
      { start: '04:00 PM', end: '04:30 PM' },
      { start: '06:00 PM', end: '06:30 PM' },
    ];

    for (const cId of ['clinic-1', 'clinic-2']) {
      const [slotRows]: any = await pool.query(`SELECT id FROM appointment_slots WHERE clinic_id = ? LIMIT 1;`, [cId]).catch(() => [[]]);
      if (!slotRows || slotRows.length === 0) {
        for (const day of days) {
          for (let i = 0; i < defaultSlots.length; i++) {
            const s = defaultSlots[i];
            const slotId = `slot-${cId}-${day.toLowerCase().slice(0, 3)}-${i + 1}`;
            await pool.query(
              `INSERT IGNORE INTO appointment_slots (id, clinic_id, day_of_week, start_time, end_time, max_capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?);`,
              [slotId, cId, day, s.start, s.end, 2, 'Active']
            ).catch(() => {});
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    const msg = (error as Error).message;
    console.error("Auto table initialization error:", msg);
    return { success: false, error: msg };
  }
}

let isTablesInitialized = false;

/**
 * Runs SQL queries against active database connection
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const pool = getPool();
  if (!pool) return null;

  if (!isTablesInitialized) {
    await autoInitDatabaseTables(pool).catch(() => {});
    isTablesInitialized = true;
  }

  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    const errMsg = (error as Error).message;
    console.warn("MySQL Database connection query failed, using static fallback dataset:", errMsg);
    if (errMsg.includes("closed") || errMsg.includes("PROTOCOL") || errMsg.includes("ECONNRESET") || errMsg.includes("doesn't exist")) {
      activePool = null;
      isTablesInitialized = false;
    }
    return null;
  }
}

export function getCurrentDatabaseUrl(): string {
  return currentDatabaseUrl || getSavedDatabaseUrl() || process.env.DATABASE_URL || "";
}

export function setCurrentDatabaseUrl(url: string) {
  if (currentDatabaseUrl !== url) {
    currentDatabaseUrl = url;
    if (activePool) {
      try {
        activePool.end().catch(() => {});
      } catch (e) {}
      activePool = null;
    }
    if (url) {
      saveDatabaseUrl(url);
    }
  }
}
