import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Public, Roles } from "../auth/access";
import { QualityService } from "./quality.service";
import {
  CreateQualityDto,
  UpdateQualityDto,
  UpdateReviewDto,
} from "./quality.dto";
@Roles("ADMIN")
@Controller("quality")
export class QualityController {
  constructor(private readonly service: QualityService) {}
  @Public() @Post("requests") create(
    @Body() body: CreateQualityDto,
    @Req() req: any,
  ) {
    return this.service.create(body, req.ip || "local");
  }
  @Get("requests") list(@Query("before") before?: string) {
    return this.service.list(before);
  }
  @Get("requests/:id") detail(@Param("id") id: string) {
    return this.service.detail(id);
  }
  @Patch("requests/:id") update(
    @Param("id") id: string,
    @Body() body: UpdateQualityDto,
    @Req() req: any,
  ) {
    return this.service.update(id, body, req.user.id);
  }
  @Get("reviews") reviews() {
    return this.service.reviews();
  }
  @Patch("reviews/:indicator") review(
    @Param("indicator", ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @Req() req: any,
  ) {
    return this.service.review(id, body, req.user.id);
  }
}
