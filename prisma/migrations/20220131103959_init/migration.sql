-- CreateTable
CREATE TABLE "PrivateFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateFile_pkey" PRIMARY KEY ("id")
);
