import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateEnrollmentRequestDto {
  @IsString()
  participantName!: string;

  @IsEmail()
  participantEmail!: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  trainingSlug?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
