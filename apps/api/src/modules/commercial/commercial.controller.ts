import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

import { Roles } from "../auth/access";

@Roles("ADMIN")
@Controller("admin/commercial")
export class CommercialController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("overview")
  async getOverview() {
    const [
      contacts,
      quotes,
      enrollments,
      campaignLeads,
      executiveApplications,
    ] = await Promise.all([
      this.prisma.contactRequest.count(),
      this.prisma.quoteRequest.count(),
      this.prisma.enrollment.count(),
      this.prisma.lead.count({ where: { source: "executive_campaign" } }),
      this.prisma.executiveApplication.count(),
    ]);

    return {
      contacts,
      quotes,
      enrollments,
      campaignLeads,
      executiveApplications,
      totalRequests:
        contacts + quotes + enrollments + campaignLeads + executiveApplications,
    };
  }
}
