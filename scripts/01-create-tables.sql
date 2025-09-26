-- Create database schema for MCQ study app
-- This script creates the core tables for sets, questions, options, and user progress

CREATE TABLE IF NOT EXISTS sets (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(36) PRIMARY KEY,
  set_id VARCHAR(36) NOT NULL,
  type ENUM('single','multi') NOT NULL,
  stem TEXT NOT NULL,
  explanation TEXT NULL,
  select_count INT NULL,
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS options (
  id VARCHAR(36) PRIMARY KEY,
  question_id VARCHAR(36) NOT NULL,
  text TEXT NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(64) NOT NULL,
  set_id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  last_result ENUM('correct','wrong') NOT NULL,
  correct_streak INT NOT NULL DEFAULT 0,
  wrong_count INT NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id, set_id, question_id)
);
