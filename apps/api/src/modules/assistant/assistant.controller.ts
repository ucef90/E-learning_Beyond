import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Module,
  Post,
  Req,
} from "@nestjs/common";
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { Request } from "express";
import { Public } from "../auth/access";
import { AssistantService } from "./assistant.service";
class AskVisitorDto {
  @IsString() @MinLength(1) @MaxLength(1000) message!: string;
  @IsOptional()
  @IsString()
  @MaxLength(180)
  @Matches(/^[a-z0-9-]+$/)
  contextSlug?: string;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @MaxLength(180, { each: true })
  @Matches(/^[a-z0-9-]+$/, { each: true })
  selectedSlugs?: string[];
}
@Controller("assistant")
export class AssistantController {
  constructor(private readonly service: AssistantService) {}
  @Public()
  @Post("ask")
  @HttpCode(200)
  ask(@Body() body: AskVisitorDto, @Req() req: Request) {
    const origin = req.get("origin");
    if (
      (origin &&
        origin !== (process.env.APP_ORIGIN || "http://127.0.0.1:3200")) ||
      req.get("sec-fetch-site") === "cross-site"
    )
      throw new ForbiddenException("Origine non autorisée.");
    return this.service.answer(body, req.ip || "local");
  }
}
@Module({ controllers: [AssistantController], providers: [AssistantService] })
export class AssistantModule {}
