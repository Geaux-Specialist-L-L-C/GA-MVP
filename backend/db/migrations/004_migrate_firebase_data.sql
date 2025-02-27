-- File: backend/db/migrations/004_migrate_firebase_data.sql
-- Description: Migrate existing Firebase data to PostgreSQL
-- Author: [Your Name]
-- Created: [Date]

-- Insert existing Firebase data into users table
INSERT INTO users (firebase_uid, email, name, role, created_at, preferences)
SELECT firebase_uid, email, name, role, created_at, preferences
FROM firebase_users;

-- Insert existing Firebase data into learning_styles table
INSERT INTO learning_styles (user_id, style, results, timestamp, created_at)
SELECT u.id, ls.style, ls.results, ls.timestamp, ls.created_at
FROM firebase_learning_styles ls
JOIN users u ON u.firebase_uid = ls.firebase_uid;

-- Insert existing Firebase data into curriculums table
INSERT INTO curriculums (user_id, title, subject, grade_level, learning_style, modules, recommendations, created_at, updated_at)
SELECT u.id, c.title, c.subject, c.grade_level, c.learning_style, c.modules, c.recommendations, c.created_at, c.updated_at
FROM firebase_curriculums c
JOIN users u ON u.firebase_uid = c.firebase_uid;

-- Ensure data consistency and integrity during migration
DO $$
BEGIN
    -- Check for any missing user references in learning_styles
    IF EXISTS (SELECT 1 FROM learning_styles ls LEFT JOIN users u ON ls.user_id = u.id WHERE u.id IS NULL) THEN
        RAISE EXCEPTION 'Data integrity issue: Missing user references in learning_styles';
    END IF;

    -- Check for any missing user references in curriculums
    IF EXISTS (SELECT 1 FROM curriculums c LEFT JOIN users u ON c.user_id = u.id WHERE u.id IS NULL) THEN
        RAISE EXCEPTION 'Data integrity issue: Missing user references in curriculums';
    END IF;
END $$;
