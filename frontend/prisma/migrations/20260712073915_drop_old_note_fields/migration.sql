/*
  Warnings:

  - You are about to drop the column `base_notes` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `heart_notes` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `top_notes` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "base_notes",
DROP COLUMN "heart_notes",
DROP COLUMN "top_notes";
