-- Rename legacy table to the current model name
ALTER TABLE "Appointement" RENAME TO "Appointment";

-- Rename legacy column to the current model name
ALTER TABLE "Appointment" RENAME COLUMN "appointementDate" TO "appointmentDate";

-- Create gender enum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Add gender to existing appointments without requiring a value
ALTER TABLE "Appointment" ADD COLUMN "gender" "Gender";
