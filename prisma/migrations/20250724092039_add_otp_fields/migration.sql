/*
  Warnings:

  - You are about to drop the column `resetToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpiry`,
    ADD COLUMN `otp` VARCHAR(6) NULL,
    ADD COLUMN `otpExpiry` DATETIME(3) NULL;
