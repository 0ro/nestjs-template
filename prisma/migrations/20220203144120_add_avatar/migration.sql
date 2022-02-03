/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "avatarId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "File_avatarId_key" ON "File"("avatarId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
