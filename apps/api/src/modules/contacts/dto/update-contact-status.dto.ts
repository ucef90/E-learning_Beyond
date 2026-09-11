import { IsEnum } from "class-validator";

export enum ContactStatusValue {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  QUALIFIED = "QUALIFIED",
  CLOSED = "CLOSED"
}

export class UpdateContactStatusDto {
  @IsEnum(ContactStatusValue)
  status!: ContactStatusValue;
}
