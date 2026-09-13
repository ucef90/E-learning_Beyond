import {
  Equals,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from "class-validator";
export class CampaignLeadDto {
  @IsUUID() requestKey!: string;
  @IsString() @Length(3, 120) programmeSlug!: string;
  @IsIn(["BROCHURE", "TARIFF", "ADVICE", "CALLBACK"]) intent!: string;
  @IsString() @Length(2, 120) fullName!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsString() @Length(2, 100) country!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(180) preferredTime?: string;
  @Equals(true) contactConsent!: boolean;
  @IsOptional() @IsObject() attribution?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(200) website?: string;
  @IsOptional() @IsString() @MaxLength(2048) turnstileToken?: string;
}
export class CampaignReceiptDto {
  @IsUUID() requestKey!: string;
}
export class CampaignEventDto {
  @IsUUID() id!: string;
  @IsIn([
    "page_view",
    "view_programme",
    "form_start",
    "download_brochure",
    "click_phone",
    "click_whatsapp",
    "start_application",
  ])
  name!: string;
  @IsString() @Length(1, 200) path!: string;
  @IsOptional() @IsString() @MaxLength(120) programmeSlug?: string;
  @Equals(true) statisticsConsent!: boolean;
  @IsOptional() @IsObject() attribution?: Record<string, unknown>;
}
export class CampaignUpdateDto {
  @IsInt() @Min(1) revision!: number;
  @IsIn([
    "NEW",
    "CONTACTED",
    "APPOINTMENT",
    "APPLICATION",
    "ENROLLED",
    "CLOSED",
  ])
  stage!: string;
  @IsString() @MaxLength(3000) note!: string;
  @IsOptional() @IsBoolean() takeOwnership?: boolean;
  @IsOptional() @IsString() @MaxLength(30) nextActionAt?: string;
  @IsOptional() @IsString() @MaxLength(120) enrollmentReference?: string;
  @IsOptional() @IsBoolean() enrollmentConfirmed?: boolean;
}
