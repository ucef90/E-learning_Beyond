import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { Public, Roles } from "../auth/access";
import { CampaignService, campaignConfiguration } from "./campaign.service";
import {
  CampaignLeadDto,
  CampaignReceiptDto,
  CampaignEventDto,
  CampaignUpdateDto,
} from "./campaign.dto";
@Roles("ADMIN")
@Controller("campaigns")
export class CampaignController {
  constructor(private service: CampaignService) {}
  @Public() @Get("configuration") config() {
    return campaignConfiguration();
  }
  @Public() @Post("leads") create(
    @Body() dto: CampaignLeadDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.ip);
  }
  @Public() @Post("receipt") receipt(
    @Body() dto: CampaignReceiptDto,
    @Req() req: any,
  ) {
    return this.service.getReceipt(dto.requestKey, req.ip);
  }
  @Public() @Post("events") event(
    @Body() dto: CampaignEventDto,
    @Req() req: any,
  ) {
    if (
      req.headers.origin !== (process.env.APP_ORIGIN || "http://127.0.0.1:3200")
    )
      throw new ForbiddenException("Origine refusée.");
    return this.service.event(dto, req.ip);
  }
  @Get("leads") list(@Query("page") page?: string) {
    return this.service.list(page);
  }
  @Get("summary") summary() {
    return this.service.summary();
  }
  @Patch("leads/:id") update(
    @Param("id") id: string,
    @Body() dto: CampaignUpdateDto,
    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user.id);
  }
}
