-- ============================================================
-- Hybrid Secure Voting System - MySQL Database Schema
-- Database Name: voting_db
-- Engine: InnoDB, Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `voting_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `voting_db`;

-- ------------------------------------------------------------
-- 1. Table: users_info
-- Stores all registered users (Voters, Admins, Students)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users_info`;
CREATE TABLE `users_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usn` VARCHAR(50) UNIQUE DEFAULT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'voter',
  `phone` VARCHAR(20) DEFAULT NULL,
  `college_email` VARCHAR(150) DEFAULT NULL,
  `college_name` VARCHAR(255) DEFAULT NULL,
  `branch` VARCHAR(100) DEFAULT NULL,
  `semester` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `division` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. Table: elections
-- Stores details of created elections
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `elections`;
CREATE TABLE `elections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `vote_start` DATETIME DEFAULT NULL,
  `vote_end` DATETIME DEFAULT NULL,
  `vote_duration` VARCHAR(100) DEFAULT NULL,
  `expired` VARCHAR(10) DEFAULT 'false',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. Table: candidates
-- Stores candidates competing in elections
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `candidates`;
CREATE TABLE `candidates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `election_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `position` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_candidates_election` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. Table: votes
-- Stores recorded votes by voters
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `votes`;
CREATE TABLE `votes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `candidate_id` INT NOT NULL,
  `candidate_name` VARCHAR(150) NOT NULL,
  `vote_title` VARCHAR(255) NOT NULL,
  `vote_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `otp` VARCHAR(20) DEFAULT NULL,
  CONSTRAINT `fk_votes_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5. Table: ElectionForm
-- Stores candidate nomination / election applications
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `ElectionForm`;
CREATE TABLE `ElectionForm` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usn` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `college` VARCHAR(255) NOT NULL,
  `division` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `branch` VARCHAR(100) NOT NULL,
  `semester` VARCHAR(20) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `applied_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Sample Initial Seed Data
-- ============================================================

-- Default Admin & Voter (Password is BCrypt hashed for "admin123" and "voter123")
INSERT INTO `users_info` (`usn`, `username`, `email`, `password`, `role`, `college_name`, `branch`)
VALUES 
  (NULL, 'admin', 'admin@voting.com', '$2a$10$7R0Z4qU3Z1nJ9Kx4.7dCe.eC/4N0n/tN8qX0Vp9x/V1l8a3lR6w.S', 'admin', 'Engineering College', 'Computer Science'),
  ('12345', 'voter1', 'voter1@voting.com', '$2a$10$7R0Z4qU3Z1nJ9Kx4.7dCe.eC/4N0n/tN8qX0Vp9x/V1l8a3lR6w.S', 'voter', 'Engineering College', 'Computer Science');

-- Sample Election
INSERT INTO `elections` (`title`, `description`, `start_date`, `end_date`, `vote_duration`, `expired`)
VALUES ('Student Council Election 2026', 'Election for Student President and Representatives', '2026-09-01', '2026-09-30', '24 Hours', 'false');

-- Sample Candidates
INSERT INTO `candidates` (`election_id`, `name`, `position`)
VALUES 
  (1, 'Alice Smith', 'President'),
  (1, 'Bob Johnson', 'President');
