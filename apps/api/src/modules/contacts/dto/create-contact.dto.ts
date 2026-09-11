import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateContactDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
