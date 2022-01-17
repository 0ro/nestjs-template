/*
  Warnings:

  - You are about to drop the `PrivateFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PrivateFile";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
