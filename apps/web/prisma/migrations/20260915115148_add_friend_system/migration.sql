-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendShip" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendShip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_status_idx" ON "FriendRequest"("receiverId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "FriendShip_userId_idx" ON "FriendShip"("userId");

-- CreateIndex
CREATE INDEX "FriendShip_friendId_idx" ON "FriendShip"("friendId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendShip_userId_friendId_key" ON "FriendShip"("userId", "friendId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
