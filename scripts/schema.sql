-- ==========================================================================
-- DOCTOR PORTFOLIO DATABASE SCHEMA & SEED DATA (MySQL)
-- Import this SQL file into PHPMyAdmin, MySQL Workbench, or your MySQL host
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS `doctor_portfolio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `doctor_portfolio`;

-- --------------------------------------------------------
-- Table structure for `doctor_profile`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `doctor_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `hero_image` TEXT,
  `about_image` TEXT,
  `qualifications` TEXT, -- JSON array string
  `experience_years` INT DEFAULT 16,
  `patients_treated` VARCHAR(50) DEFAULT '5,400+',
  `patient_satisfaction_rate` FLOAT DEFAULT 98.4,
  `rating` FLOAT DEFAULT 4.9,
  `review_count` INT DEFAULT 742,
  `bio` TEXT,
  `mission` TEXT,
  `vision` TEXT,
  `address` VARCHAR(255),
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `zip` VARCHAR(20),
  `google_maps_url` TEXT,
  `phone` VARCHAR(50),
  `emergency_phone` VARCHAR(50),
  `email` VARCHAR(100),
  `working_hours` TEXT, -- JSON array string
  `socials` TEXT, -- JSON array string
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data for `doctor_profile`
INSERT INTO `doctor_profile` (
  `id`, `name`, `title`, `hero_image`, `about_image`, `qualifications`,
  `experience_years`, `patients_treated`, `patient_satisfaction_rate`, `rating`, `review_count`,
  `bio`, `mission`, `vision`, `address`, `city`, `state`, `zip`, `google_maps_url`,
  `phone`, `emergency_phone`, `email`, `working_hours`, `socials`
) VALUES (
  1,
  'Dr. Farzana Khan Mohima',
  'Lead Interventional Cardiologist & Cardiovascular Specialist',
  'https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png',
  'https://aavisstudio.com/wp-content/uploads/2026/07/farzana-khan-mohima.png',
  '["MD - Johns Hopkins University School of Medicine", "FACC - Fellow of the American College of Cardiology", "Board Certified in Cardiovascular Disease"]',
  16,
  '5,400+',
  98.4,
  4.9,
  742,
  'Dr. Farzana Khan Mohima is a world-renowned Interventional Cardiologist with over 16 years of clinical excellence in non-invasive diagnostic cardiology, complex coronary interventions, and preventive cardiovascular medicine.',
  'To deliver world-class, human-centric cardiovascular health services with absolute medical precision, empathy, and transparent clinical care.',
  'To pioneer preventive cardiac care models that empower patients to live longer, healthier lives free from cardiovascular compromise.',
  '149 Health Avenue, Suite 400',
  'New York',
  'NY',
  '10001',
  'https://maps.google.com',
  '+1 (800) 458-9221',
  '+1 (800) 999-CARE',
  'consultations@drvancecardiology.com',
  '[{"days": "Monday – Thursday", "hours": "08:00 AM – 05:00 PM"}, {"days": "Friday", "hours": "08:00 AM – 03:00 PM"}]',
  '[{"platform": "linkedin", "url": "https://linkedin.com"}, {"platform": "twitter", "url": "https://twitter.com"}]'
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------
-- Table structure for `services`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `short_description` TEXT,
  `full_description` TEXT,
  `icon_name` VARCHAR(50) DEFAULT 'ClipboardList',
  `image` TEXT,
  `key_benefits` TEXT, -- JSON array
  `estimated_duration` VARCHAR(50) DEFAULT '45-60 mins',
  `category` VARCHAR(50) DEFAULT 'clinical'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `gallery`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'clinic',
  `image` TEXT NOT NULL,
  `caption` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for `testimonials`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(50) PRIMARY KEY,
  `patient_name` VARCHAR(255) NOT NULL,
  `patient_role_or_condition` VARCHAR(255),
  `patient_avatar` TEXT,
  `rating` INT DEFAULT 5,
  `review_text` TEXT NOT NULL,
  `date` VARCHAR(50),
  `verified_google_review` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
