import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteStatusDto } from "./dto/update-quote-status.dto";

@Injectable()
export class QuotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly turnstileService: TurnstileService
  ) {}

  async findAll() {
    const quotes = await this.prisma.quoteRequest.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return quotes.map((quote) => ({
      id: quote.id,
      companyName: quote.companyName,
      contactName: quote.contactName,
      email: quote.email,
      requestedMode: quote.requestedMode,
      participants: quote.participants,
      brief: quote.brief,
      status: quote.status,
      createdAt: quote.createdAt.toISOString()
    }));
  }

  async create(payload: CreateQuoteDto) {
    await this.turnstileService.verify(payload.turnstileToken);

    const company = payload.companyName
      ? await this.prisma.company.upsert({
          where: {
            slug: payload.companyName
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          },
          update: {
            name: payload.companyName
          },
          create: {
            name: payload.companyName,
            slug: payload.companyName
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          }
        })
      : null;

    const quote = await this.prisma.quoteRequest.create({
      data: {
        companyId: company?.id,
        companyName: payload.companyName,
        contactName: payload.contactName,
        email: payload.email,
        requestedMode: payload.requestedMode,
        participants: payload.participants,
        brief: payload.brief
      }
    });

    return {
      id: quote.id,
      status: quote.status,
      submittedAt: quote.createdAt.toISOString()
    };
  }

  async updateStatus(id: string, payload: UpdateQuoteStatusDto) {
    const quote = await this.prisma.quoteRequest.update({
      where: { id },
      data: {
        status: payload.status
      }
    });

    return {
      id: quote.id,
      status: quote.status,
      updatedAt: quote.updatedAt.toISOString()
    };
  }
}
