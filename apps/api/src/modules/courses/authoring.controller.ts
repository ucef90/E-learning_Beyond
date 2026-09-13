import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthoringService } from "./authoring.service";
import {
  AuthoringCourse,
  ResourceInput,
  AssetInput,
  ReviewInput,
  EditorsInput,
  RevisionDto,
  AccessInput,
  PositioningInput,
  WrittenWorkInput,
} from "./authoring.dto";
@Controller("courses")
export class AuthoringController {
  constructor(private readonly service: AuthoringService) {}
  @Get("authoring/list") list(@Req() req: any) {
    return this.service.list(req.user);
  }
  @Post("authoring") create(@Req() req: any, @Body() body: AuthoringCourse) {
    return this.service.save(req.user, null, body);
  }
  @Get(":id/authoring") detail(@Req() req: any, @Param("id") id: string) {
    return this.service.detail(req.user, id);
  }
  @Put(":id/authoring") save(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: AuthoringCourse,
  ) {
    return this.service.save(req.user, id, body);
  }
  @Put(":id/authoring/resource") resource(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: ResourceInput,
  ) {
    return this.service.resource(req.user, id, body);
  }
  @Put(":id/authoring/review") review(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: ReviewInput,
  ) {
    return this.service.review(req.user, id, body);
  }
  @Put(":id/authoring/editors") editors(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: EditorsInput,
  ) {
    return this.service.editors(req.user, id, body);
  }
  @Get(":id/assets") assets(@Req() req: any, @Param("id") id: string) {
    return this.service.assets(req.user, id);
  }
  @Post(":id/assets") addAsset(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: AssetInput,
  ) {
    return this.service.addAsset(req.user, id, body);
  }
  @Delete(":id/assets/:assetId") removeAsset(
    @Req() req: any,
    @Param("id") id: string,
    @Param("assetId") assetId: string,
    @Body() body: RevisionDto,
  ) {
    return this.service.removeAsset(req.user, id, assetId, body.revision);
  }
  @Get(":id/assets/:assetId/download") async download(
    @Req() req: any,
    @Param("id") id: string,
    @Param("assetId") assetId: string,
    @Res() res: Response,
  ) {
    const file = await this.service.download(req.user, id, assetId);
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename*=UTF-8''" + encodeURIComponent(file.filename),
    );
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Length", file.size);
    res.end(Buffer.from(file.content));
  }
  @Put(":id/learners/:userId/access") access(
    @Req() req: any,
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Body() body: AccessInput,
  ) {
    return this.service.access(req.user, id, userId, body);
  }
  @Put(":id/positioning") position(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: PositioningInput,
  ) {
    return this.service.position(req.user, id, body);
  }
  @Post(":id/written-submissions") written(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: WrittenWorkInput,
  ) {
    return this.service.written(req.user, id, body);
  }
}
