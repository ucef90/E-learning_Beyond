import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

import { Roles } from "../auth/access";

@Roles("ADMIN")
@Controller("admin/commercial")
export class CommercialController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("overview")
  async getOverview() {
    const [contacts, quotes, enrollments] = await Promise.all([
      this.prisma.contactRequest.count(),
      this.prisma.quoteRequest.count(),
      this.prisma.enrollment.count(),
    ]);

    return {
      contacts,
      quotes,
      enrollments,
      totalRequests: contacts + quotes + enrollments,
    };
  }
}
