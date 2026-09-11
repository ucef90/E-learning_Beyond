import { Type } from "class-transformer";
import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsObject,
  IsEmail,
  IsIn,
} from "class-validator";
export class LessonDto {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsString() @MinLength(20) @MaxLength(30000) body!: string;
  @IsInt() @Min(1) @Max(120) durationMin!: number;
  @IsOptional() @IsString() @MaxLength(2000) videoUrl?: string;
  @IsOptional() @IsString() @MaxLength(30000) transcript?: string;
}
export class CourseDto {
  @IsString() @MinLength(3) @MaxLength(200) title!: string;
  @IsString() @MinLength(10) @MaxLength(2000) summary!: string;
  @IsString() @MinLength(3) @MaxLength(200) moduleTitle!: string;
  @IsObject() brief!: Record<string, unknown>;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => LessonDto)
  lessons!: LessonDto[];
}
export class AssignDto {
  @IsString() @MaxLength(100) userId!: string;
  @IsString() @MaxLength(100) trainerId!: string;
  @IsString() @MinLength(2) @MaxLength(100) groupName!: string;
}
export class ProgressDto {
  @IsBoolean() completed!: boolean;
}
export class NotebookDto {
  @IsObject() notebook!: Record<string, unknown>;
  @IsInt() @Min(0) revision!: number;
}
export class SubmitDto {
  @IsObject() notebook!: Record<string, unknown>;
  @IsString() @MaxLength(3000) comment!: string;
}
export class ReviewDto {
  @IsString() @MinLength(10) @MaxLength(10000) feedback!: string;
  @IsInt() @Min(0) @Max(100) grade!: number;
}
export class QuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  answers!: string[];
}
export class AccountDto {
  @IsEmail() @MaxLength(200) email!: string;
  @IsString() @MinLength(2) @MaxLength(150) fullName!: string;
  @IsIn(["ADMIN", "TRAINER", "LEARNER"]) role!: string;
}
