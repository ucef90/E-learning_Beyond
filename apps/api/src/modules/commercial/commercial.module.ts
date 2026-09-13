import { Module } from "@nestjs/common";
import { CommercialController } from "./commercial.controller";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";

@Module({
  controllers: [CommercialController, CampaignController],
  providers: [CampaignService],
})
export class CommercialModule {}
