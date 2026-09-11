import { IsEnum } from "class-validator";

export enum QuoteStatusValue {
  NEW = "NEW",
  QUALIFIED = "QUALIFIED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  WON = "WON",
  LOST = "LOST"
}

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatusValue)
  status!: QuoteStatusValue;
}
