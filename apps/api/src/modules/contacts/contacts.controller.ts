import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactStatusDto } from "./dto/update-contact-status.dto";

import { Public, Roles } from "../auth/access";

@Roles("ADMIN")
@Controller("contacts")
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Public()
  @Post()
  create(@Body() body: CreateContactDto) {
    return this.contactsService.create(body);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: UpdateContactStatusDto) {
    return this.contactsService.updateStatus(id, body);
  }
}
