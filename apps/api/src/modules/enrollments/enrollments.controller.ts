import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import { CreateEnrollmentRequestDto } from "./dto/create-enrollment-request.dto";
import { UpdateEnrollmentStatusDto } from "./dto/update-enrollment-status.dto";

import { Public, Roles } from "../auth/access";

@Roles("ADMIN")
@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Public()
  @Post()
  create(@Body() body: CreateEnrollmentRequestDto) {
    return this.enrollmentsService.createRequest(body);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateEnrollmentStatusDto,
  ) {
    return this.enrollmentsService.updateStatus(id, body);
  }
}
