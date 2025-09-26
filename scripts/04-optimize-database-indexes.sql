-- Database Optimization Script for NowCards
-- This script adds indexes to improve performance with large datasets (300+ questions)

-- ==============================================
-- 1. OPTIMIZE QUESTIONS TABLE
-- ==============================================

-- Index for filtering questions by set_id (most common query)
CREATE INDEX IF NOT EXISTS idx_questions_set_id ON questions (set_id);

-- Index for filtering by question type
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions (type);

-- Composite index for set_id + type (for filtered queries)
CREATE INDEX IF NOT EXISTS idx_questions_set_type ON questions (set_id, type);

-- Index for ordering questions (if needed)
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions (created_at);

-- ==============================================
-- 2. OPTIMIZE QUESTION_OPTIONS TABLE
-- ==============================================

-- Index for filtering options by question_id (most common query)
CREATE INDEX IF NOT EXISTS idx_options_question_id ON question_options (question_id);

-- Index for filtering correct options
CREATE INDEX IF NOT EXISTS idx_options_is_correct ON question_options (is_correct);

-- Composite index for question_id + is_correct (for finding correct answers)
CREATE INDEX IF NOT EXISTS idx_options_question_correct ON question_options (question_id, is_correct);

-- ==============================================
-- 3. OPTIMIZE USER_PROGRESS TABLE
-- ==============================================

-- Index for filtering by user_id (most common query)
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress (user_id);

-- Index for filtering by set_id
CREATE INDEX IF NOT EXISTS idx_progress_set_id ON user_progress (set_id);

-- Index for filtering by question_id
CREATE INDEX IF NOT EXISTS idx_progress_question_id ON user_progress (question_id);

-- Composite index for user_id + set_id (for user progress by set)
CREATE INDEX IF NOT EXISTS idx_progress_user_set ON user_progress (user_id, set_id);

-- Composite index for user_id + question_id (for specific question progress)
CREATE INDEX IF NOT EXISTS idx_progress_user_question ON user_progress (user_id, question_id);

-- Index for ordering by creation date
CREATE INDEX IF NOT EXISTS idx_progress_created_at ON user_progress (created_at);

-- ==============================================
-- 4. OPTIMIZE STUDY_SETS TABLE
-- ==============================================

-- Index for ordering sets by creation date
CREATE INDEX IF NOT EXISTS idx_sets_created_at ON study_sets (created_at);

-- Index for searching by title (if needed)
CREATE INDEX IF NOT EXISTS idx_sets_title ON study_sets (title);

-- ==============================================
-- 5. ADDITIONAL PERFORMANCE OPTIMIZATIONS
-- ==============================================

-- Analyze tables to update statistics (helps MySQL optimizer)
ANALYZE TABLE study_sets;
ANALYZE TABLE questions;
ANALYZE TABLE question_options;
ANALYZE TABLE user_progress;

-- ==============================================
-- 6. QUERY OPTIMIZATION RECOMMENDATIONS
-- ==============================================

-- For the main study session query, ensure you're using:
-- SELECT q.*, qo.* FROM questions q 
-- LEFT JOIN question_options qo ON q.id = qo.question_id 
-- WHERE q.set_id = ? 
-- ORDER BY q.id, qo.id;

-- This query will benefit from:
-- - idx_questions_set_id (for WHERE clause)
-- - idx_options_question_id (for JOIN)
-- - Primary keys (for ORDER BY)

-- ==============================================
-- 7. MONITORING QUERIES
-- ==============================================

-- Check index usage:
-- SHOW INDEX FROM questions;
-- SHOW INDEX FROM question_options;
-- SHOW INDEX FROM user_progress;

-- Check query performance:
-- EXPLAIN SELECT * FROM questions WHERE set_id = 'your-set-id';
-- EXPLAIN SELECT * FROM question_options WHERE question_id = 'your-question-id';

-- ==============================================
-- 8. ADDITIONAL OPTIMIZATIONS FOR LARGE DATASETS
-- ==============================================

-- If you have 1000+ questions, consider partitioning:
-- ALTER TABLE questions PARTITION BY HASH(set_id) PARTITIONS 4;

-- For very large user_progress tables, consider archiving old data:
-- CREATE TABLE user_progress_archive LIKE user_progress;
-- INSERT INTO user_progress_archive SELECT * FROM user_progress WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
-- DELETE FROM user_progress WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
