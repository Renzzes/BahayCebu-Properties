-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetToken` TEXT NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
