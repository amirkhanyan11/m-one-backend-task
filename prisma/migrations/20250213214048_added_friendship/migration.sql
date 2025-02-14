-- CreateTable
CREATE TABLE "Friendship" (
    "status" TEXT NOT NULL DEFAULT 'pending',
    "friendOfId" INTEGER NOT NULL,
    "friendsId" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendsId","friendOfId")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendOfId_fkey" FOREIGN KEY ("friendOfId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendsId_fkey" FOREIGN KEY ("friendsId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
