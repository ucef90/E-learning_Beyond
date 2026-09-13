import {
  Equals,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
} from "class-validator";
export class CreateExecutiveApplication {
  @IsUUID() requestKey!: string;
  @IsString() @Length(3, 120) programmeSlug!: string;
  @IsIn(["APPLICATION", "INFORMATION", "COMPANY"]) requestType!: string;
  @IsString() @Length(2, 120) fullName!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsString() @Length(2, 100) country!: string;
  @IsOptional() @IsString() @MaxLength(120) city?: string;
  @IsString() @Length(2, 250) qualification!: string;
  @IsInt() @Min(0) @Max(70) experience!: number;
  @IsString() @Length(2, 200) currentRole!: string;
  @IsOptional() @IsString() @MaxLength(200) company?: string;
  @IsString() @Length(30, 5000) motivation!: string;
  @IsIn(["SELF", "EMPLOYER", "TO_DISCUSS"]) funding!: string;
  @Equals(true) consent!: boolean;
  @IsOptional() @IsString() @MaxLength(200) website?: string;
  @IsOptional() @IsString() @MaxLength(2048) turnstileToken?: string;
}
export class UpdateExecutiveApplication {
  @IsInt() @Min(1) revision!: number;
  @IsIn([
    "RECEIVED",
    "REVIEW",
    "INTERVIEW",
    "ACCEPTED",
    "WAITLIST",
    "DECLINED",
    "CLOSED",
  ])
  status!: string;
  @IsString() @MaxLength(6000) internalNote!: string;
}
