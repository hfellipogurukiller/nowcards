-- Update schema for admin functionality
-- Add new columns to support question management

-- Add columns to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS domain VARCHAR(100),
ADD COLUMN IF NOT EXISTS tags JSON,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add columns to study_sets table  
ALTER TABLE study_sets
ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
CREATE INDEX IF NOT EXISTS idx_questions_set_id ON questions(set_id);

-- Update existing questions with default values
UPDATE questions SET difficulty = 'medium' WHERE difficulty IS NULL;
UPDATE questions SET domain = 'General' WHERE domain IS NULL;
