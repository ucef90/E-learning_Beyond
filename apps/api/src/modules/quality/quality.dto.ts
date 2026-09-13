import {
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  Length,
  MaxLength,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsISO8601,
} from "class-validator";
export class CreateQualityDto {
  @IsUUID() requestKey!: string;
  @IsIn([
    "ASSISTANCE",
    "ACCESSIBILITY",
    "COMPLAINT",
    "NEEDS",
    "SATISFACTION",
    "TEACHING",
    "ALERT",
    "DATA_RIGHTS",
  ])
  kind!: string;
  @IsString() @Length(2, 120) fullName!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsIn(["LEARNER", "TRAINER", "COMPANY", "FUNDER", "OTHER"])
  stakeholder!: string;
  @IsString() @MaxLength(240) context!: string;
  @IsString() @Length(10, 5000) message!: string;
  @IsOptional()
  @IsIn(["BEGINNER", "BASIC", "PRACTICED", "ADVANCED"])
  currentLevel?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsString() @MaxLength(2048) turnstileToken?: string;
  @IsOptional() @IsString() @MaxLength(100) website?: string;
}
export class UpdateQualityDto {
  @IsInt() @Min(1) revision!: number;
  @IsIn(["NEW", "IN_PROGRESS", "CLOSED"]) status!: string;
  @IsString() @MaxLength(120) assignee!: string;
  @IsOptional() @IsISO8601() dueDate?: string;
  @IsString() @MaxLength(5000) resolution!: string;
  @IsString() @MaxLength(500) responseReference!: string;
  @IsString() @Length(10, 2000) note!: string;
}
export class UpdateReviewDto {
  @IsInt() @Min(0) revision!: number;
  @IsIn([
    "TO_COLLECT",
    "IN_PROGRESS",
    "TO_REVIEW",
    "REVIEWED",
    "NOT_APPLICABLE",
  ])
  status!: string;
  @IsIn(["DRAFT", "TEST", "REAL"]) evidenceKind!: string;
  @IsString() @MaxLength(1500) evidenceReference!: string;
  @IsString() @MaxLength(120) owner!: string;
  @IsString() @Length(10, 4000) note!: string;
  @IsOptional() @IsISO8601() dueDate?: string;
}
