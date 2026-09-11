import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

export class RegisterDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
