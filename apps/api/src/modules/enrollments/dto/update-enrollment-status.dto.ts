import { IsEnum } from "class-validator";

export enum EnrollmentStatusValue {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  WAITLISTED = "WAITLISTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export class UpdateEnrollmentStatusDto {
  @IsEnum(EnrollmentStatusValue)
  status!: EnrollmentStatusValue;
}
