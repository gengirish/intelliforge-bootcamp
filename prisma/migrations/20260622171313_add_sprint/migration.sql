-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priceInPaise" INTEGER NOT NULL,
    "originalPriceInPaise" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "seatsTotal" INTEGER NOT NULL DEFAULT 30,
    "seatsFilled" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprintEnrollment" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "amountInPaise" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "SprintEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_slug_key" ON "Sprint"("slug");

-- CreateIndex
CREATE INDEX "Sprint_slug_idx" ON "Sprint"("slug");

-- CreateIndex
CREATE INDEX "Sprint_isActive_idx" ON "Sprint"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SprintEnrollment_razorpayOrderId_key" ON "SprintEnrollment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "SprintEnrollment_razorpayPaymentId_key" ON "SprintEnrollment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "SprintEnrollment_userId_idx" ON "SprintEnrollment"("userId");

-- CreateIndex
CREATE INDEX "SprintEnrollment_sprintId_idx" ON "SprintEnrollment"("sprintId");

-- CreateIndex
CREATE INDEX "SprintEnrollment_status_idx" ON "SprintEnrollment"("status");

-- CreateIndex
CREATE INDEX "SprintEnrollment_razorpayOrderId_idx" ON "SprintEnrollment"("razorpayOrderId");

-- AddForeignKey
ALTER TABLE "SprintEnrollment" ADD CONSTRAINT "SprintEnrollment_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
