-- CreateTable
CREATE TABLE "public"."MockInterview" (
    "id" SERIAL NOT NULL,
    "jsonMockResp" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "jobDesc" TEXT NOT NULL,
    "jobExperience" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TEXT,
    "mockId" TEXT NOT NULL,

    CONSTRAINT "MockInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAnswer" (
    "id" SERIAL NOT NULL,
    "mockIdRef" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAns" TEXT,
    "userAns" TEXT,
    "feedback" TEXT,
    "rating" TEXT,
    "userEmail" TEXT,
    "createdAt" TEXT,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockInterview_mockId_key" ON "public"."MockInterview"("mockId");

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_mockIdRef_fkey" FOREIGN KEY ("mockIdRef") REFERENCES "public"."MockInterview"("mockId") ON DELETE RESTRICT ON UPDATE CASCADE;
