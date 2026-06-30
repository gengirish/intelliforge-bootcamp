-- CreateEnum
CREATE TYPE "BootcampPlan" AS ENUM ('earlyBird', 'regular');

-- AlterTable
ALTER TABLE "SprintEnrollment" ADD COLUMN "lmsEnrolledAt" TIMESTAMP(3),
ADD COLUMN "lmsEnrollmentError" TEXT;

-- CreateTable
CREATE TABLE "BootcampEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "plan" "BootcampPlan" NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "amountInPaise" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "lmsEnrolledAt" TIMESTAMP(3),
    "lmsEnrollmentError" TEXT,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "BootcampEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BootcampEnrollment_razorpayOrderId_key" ON "BootcampEnrollment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "BootcampEnrollment_razorpayPaymentId_key" ON "BootcampEnrollment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "BootcampEnrollment_userId_idx" ON "BootcampEnrollment"("userId");

-- CreateIndex
CREATE INDEX "BootcampEnrollment_status_idx" ON "BootcampEnrollment"("status");

-- CreateIndex
CREATE INDEX "BootcampEnrollment_razorpayOrderId_idx" ON "BootcampEnrollment"("razorpayOrderId");
