-- File: backend/db/migrations/003_create_curriculums_table.sql
-- Description: Create curriculums table in PostgreSQL
-- Author: [Your Name]
-- Created: [Date]

CREATE TABLE curriculums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    grade_level VARCHAR(50),
    learning_style VARCHAR(255),
    modules JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE curriculums
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_curriculums_user_id ON curriculums(user_id);
