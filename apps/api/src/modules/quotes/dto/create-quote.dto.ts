import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export enum DeliveryMode {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ELEARNING = "ELEARNING"
}

export class CreateQuoteDto {
  @IsString()
  companyName!: string;

  @IsString()
  contactName!: string;

  @IsEmail()
  email!: string;

  @IsEnum(DeliveryMode)
  requestedMode!: DeliveryMode;

  @IsOptional()
  @IsInt()
  @Min(1)
  participants?: number;

  @IsString()
  brief!: string;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
