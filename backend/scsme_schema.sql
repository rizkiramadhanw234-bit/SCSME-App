-- ============================================================
-- SCSME — Selangor Chamber of Small and Medium Entrepreneurs
-- Full Database Schema (MySQL 8+, InnoDB, utf8mb4)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. USERS (member-side identity: guest/member/corporate/sponsor)
-- ============================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('guest','member','corporate','sponsor') NOT NULL DEFAULT 'member',
  `status` ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. ADMINS (separate identity table for admin-side roles)
-- ============================================================
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `admin_role` ENUM('staff','super_admin') NOT NULL DEFAULT 'staff',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. COMPANIES (1:1 / 1:N with users)
-- ============================================================
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `verification_status` ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `idx_companies_user_id` (`user_id`),
  CONSTRAINT `fk_companies_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. MEMBERSHIP PLANS
-- ============================================================
DROP TABLE IF EXISTS `membership_plans`;
CREATE TABLE `membership_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plan_name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `duration_days` INT UNSIGNED NOT NULL,
  `benefits` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. SUBSCRIPTIONS
-- ============================================================
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `plan_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `payment_status` ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `renewal_status` ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_subscriptions_user_id` (`user_id`),
  KEY `idx_subscriptions_plan_id` (`plan_id`),
  KEY `idx_subscriptions_end_date` (`end_date`),
  CONSTRAINT `fk_subscriptions_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_subscriptions_plan`
    FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. EVENTS
-- ============================================================
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `event_date` DATETIME NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `capacity` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('draft','published','cancelled') NOT NULL DEFAULT 'draft',
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `language` VARCHAR(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_events_status` (`status`),
  KEY `idx_events_event_date` (`event_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. EVENT REGISTRATIONS
-- ============================================================
DROP TABLE IF EXISTS `event_registrations`;
CREATE TABLE `event_registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `ticket_type` ENUM('standard','vip') NOT NULL DEFAULT 'standard',
  `payment_status` ENUM('pending','paid','refunded') NOT NULL DEFAULT 'pending',
  `qr_code` VARCHAR(255) DEFAULT NULL,
  `attendance_status` ENUM('registered','attended','absent') NOT NULL DEFAULT 'registered',
  `certificate_url` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_event_reg_event_id` (`event_id`),
  KEY `idx_event_reg_user_id` (`user_id`),
  UNIQUE KEY `uq_event_reg_event_user` (`event_id`, `user_id`),
  CONSTRAINT `fk_event_reg_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_event_reg_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. RESOURCES
-- ============================================================
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `type` ENUM('article','template','replay','course') NOT NULL,
  `access_level` ENUM('public','member','paid') NOT NULL DEFAULT 'public',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `file_url` VARCHAR(500) DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_resources_access_level` (`access_level`),
  KEY `idx_resources_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. RESOURCE PURCHASES (tracks paid resource access)
-- ============================================================
DROP TABLE IF EXISTS `resource_purchases`;
CREATE TABLE `resource_purchases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `resource_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `payment_status` ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resource_purchases_resource_id` (`resource_id`),
  KEY `idx_resource_purchases_user_id` (`user_id`),
  CONSTRAINT `fk_resource_purchases_resource`
    FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_resource_purchases_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. PAID UPLOADS
-- ============================================================
DROP TABLE IF EXISTS `paid_uploads`;
CREATE TABLE `paid_uploads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `company_id` INT UNSIGNED NOT NULL,
  `upload_type` ENUM(
    'banner','brand','product_service','sponsored_article',
    'push_notification','featured_listing',
    'event_sponsor','training_sponsor','resource_sponsor'
  ) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `placement` VARCHAR(100) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM(
    'draft','pending_payment','pending_review','revision_required',
    'scheduled','published','expired','rejected'
  ) NOT NULL DEFAULT 'draft',
  `admin_notes` TEXT DEFAULT NULL,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` VARCHAR(500) DEFAULT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_paid_uploads_user_id` (`user_id`),
  KEY `idx_paid_uploads_company_id` (`company_id`),
  KEY `idx_paid_uploads_status` (`status`),
  KEY `idx_paid_uploads_end_date` (`end_date`),
  CONSTRAINT `fk_paid_uploads_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_paid_uploads_company`
    FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. AD PLACEMENTS
-- ============================================================
DROP TABLE IF EXISTS `ad_placements`;
CREATE TABLE `ad_placements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paid_upload_id` INT UNSIGNED NOT NULL,
  `page` VARCHAR(100) NOT NULL,
  `position` VARCHAR(100) DEFAULT NULL,
  `impressions` INT UNSIGNED NOT NULL DEFAULT 0,
  `clicks` INT UNSIGNED NOT NULL DEFAULT 0,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ad_placements_paid_upload_id` (`paid_upload_id`),
  KEY `idx_ad_placements_expires_at` (`expires_at`),
  CONSTRAINT `fk_ad_placements_paid_upload`
    FOREIGN KEY (`paid_upload_id`) REFERENCES `paid_uploads` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. PAYMENTS
-- Polymorphic reference via order_type + order_id (no FK enforced
-- across multiple tables; integrity handled at application level)
-- ============================================================
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `order_type` ENUM('membership','event','resource','paid_upload') NOT NULL,
  `order_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_status` ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `invoice_url` VARCHAR(500) DEFAULT NULL,
  `proof_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_user_id` (`user_id`),
  KEY `idx_payments_order` (`order_type`, `order_id`),
  KEY `idx_payments_status` (`payment_status`),
  CONSTRAINT `fk_payments_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. ADMIN LOGS (FK to admins, not users)
-- ============================================================
DROP TABLE IF EXISTS `admin_logs`;
CREATE TABLE `admin_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_type` VARCHAR(100) NOT NULL,
  `target_id` INT UNSIGNED NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_logs_admin_id` (`admin_id`),
  KEY `idx_admin_logs_target` (`target_type`, `target_id`),
  CONSTRAINT `fk_admin_logs_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED DATA (optional defaults)
-- ============================================================

-- Default super admin (change password_hash before deploying!)
INSERT INTO `admins` (`name`, `email`, `password_hash`, `admin_role`, `is_active`)
VALUES ('Super Admin', 'admin@scsme.org.my', '$2b$10$REPLACE_WITH_REAL_HASH', 'super_admin', 1);

-- Default membership plans
INSERT INTO `membership_plans` (`plan_name`, `price`, `duration_days`, `benefits`, `is_active`)
VALUES
  ('Basic', 0.00, 365, 'Free profile listing, free event access', 1),
  ('Standard', 300.00, 365, 'Directory listing, member-tier resources, event discounts', 1),
  ('Corporate', 800.00, 365, 'Team seats, higher ad exposure, full resource access', 1);
