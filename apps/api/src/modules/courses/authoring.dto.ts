import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
export class AnswerInput {
  @IsString() @MinLength(1) @MaxLength(2000) label!: string;
  @IsBoolean() isCorrect!: boolean;
}
export class QuestionInput {
  @IsString() @MinLength(5) @MaxLength(3000) prompt!: string;
  @IsString() @MinLength(10) @MaxLength(5000) explanation!: string;
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => AnswerInput)
  answers!: AnswerInput[];
}
export class QuizInput {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsInt() @Min(1) @Max(100) passingScore!: number;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => QuestionInput)
  questions!: QuestionInput[];
}
export class AuthoringLesson {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsIn(["TEXT", "PDF", "QUIZ"]) type!: "TEXT" | "PDF" | "QUIZ";
  @IsString() @MaxLength(30000) body!: string;
  @IsInt() @Min(1) @Max(240) durationMin!: number;
  @IsOptional() @IsString() @MaxLength(2000) videoUrl?: string;
  @IsOptional() @IsString() @MaxLength(30000) transcript?: string;
  @IsOptional() @ValidateNested() @Type(() => QuizInput) quiz?: QuizInput;
}
export class AuthoringModule {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => AuthoringLesson)
  lessons!: AuthoringLesson[];
}
export class AuthoringCourse {
  @IsInt() @Min(1) revision!: number;
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsString() @MinLength(10) @MaxLength(2000) summary!: string;
  @IsOptional() @IsString() @MaxLength(100) trainingId?: string | null;
  @IsObject() brief!: Record<string, string>;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(24)
  @ValidateNested({ each: true })
  @Type(() => AuthoringModule)
  modules!: AuthoringModule[];
  @IsIn(["NOTEBOOK", "WRITTEN", "NONE"]) assessmentMode!:
    "NOTEBOOK" | "WRITTEN" | "NONE";
  @IsInt() @Min(1) @Max(100) assessmentScore!: number;
  @IsString() @MaxLength(5000) rubric!: string;
}
export class RevisionDto {
  @IsInt() @Min(1) revision!: number;
}
export class ResourceInput extends RevisionDto {
  @IsIn(["starter", "practice", "solution", "csv"]) name!: string;
  @IsOptional() @IsObject() notebook?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(500000) csv?: string;
}
export class AssetInput extends RevisionDto {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsString() @MinLength(1) @MaxLength(150) filename!: string;
  @IsString() @MaxLength(1400000) base64!: string;
  @IsIn(["LEARNER", "AFTER_REVIEW", "STAFF"]) visibility!: string;
}
export class ReviewInput extends RevisionDto {
  @IsIn(["SUBMIT", "APPROVE", "CHANGES", "PUBLISH", "UNPUBLISH"])
  action!: string;
  @IsString() @MinLength(10) @MaxLength(5000) note!: string;
}
export class EditorsInput extends RevisionDto {
  @IsArray() @ArrayMaxSize(20) @IsString({ each: true }) editorIds!: string[];
}
export class AccessInput {
  @IsIn(["ACTIVE", "REVOKED"]) status!: string;
  @IsOptional() @IsISO8601() expiresAt?: string | null;
  @IsString() @MinLength(5) @MaxLength(1000) reason!: string;
  @IsOptional() @IsString() @MaxLength(100) trainerId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) groupName?: string;
}
export class PositioningInput {
  @IsString() @MinLength(10) @MaxLength(3000) goals!: string;
  @IsString() @MinLength(5) @MaxLength(3000) experience!: string;
  @IsString() @MinLength(5) @MaxLength(3000) equipment!: string;
  @IsOptional() @IsString() @MaxLength(2000) support?: string;
}
export class WrittenWorkInput {
  @IsString() @MinLength(30) @MaxLength(30000) writtenWork!: string;
  @IsString() @MaxLength(3000) comment!: string;
}
