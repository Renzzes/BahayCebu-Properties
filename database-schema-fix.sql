-- Database Schema Fix for Hostinger MySQL Database
-- This script adds the missing 'role' column to the User table

-- Add the role column to the User table
ALTER TABLE User ADD COLUMN role VARCHAR(50) DEFAULT 'USER';

-- Update existing users to have the USER role if they don't have one
UPDATE User SET role = 'USER' WHERE role IS NULL OR role = '';

-- Verify the changes
SELECT id, email, name, role, createdAt FROM User LIMIT 5;

-- Show the updated table structure
DESCRIBE User;

-- Optional: Create an index on the role column for better performance
CREATE INDEX idx_user_role ON User(role);

-- Note: Run this script on your Hostinger MySQL database
-- You can access your database through:
-- 1. Hostinger hPanel > Databases > phpMyAdmin
-- 2. Or use a MySQL client with these credentials:
--    Host: 153.92.15.81
--    Port: 3306
--    Database: u547531148_bahaycebu_db
--    Username: u547531148_bahaycebu_admi
--    Password: Bahaycebu-1231