/*
  Warnings:

  - You are about to drop the column `otp` on the `PasswordReset` table. All the data in the column will be lost.
  - Added the required column `otpHash` to the `PasswordReset` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PasswordReset_otp_key";

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "otp",
ADD COLUMN     "otpHash" TEXT NOT NULL;
