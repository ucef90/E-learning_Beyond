import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteStatusDto } from "./dto/update-quote-status.dto";

import { Public, Roles } from "../auth/access";

@Roles("ADMIN")
@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Public()
  @Post()
  create(@Body() body: CreateQuoteDto) {
    return this.quotesService.create(body);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: UpdateQuoteStatusDto) {
    return this.quotesService.updateStatus(id, body);
  }
}
