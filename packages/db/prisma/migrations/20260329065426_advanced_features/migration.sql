-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "allowComments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "anonymizeData" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOtherOption" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hideShareButton" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireNames" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resultsVisibility" TEXT NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "customAnswer" TEXT,
ADD COLUMN     "voterName" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
