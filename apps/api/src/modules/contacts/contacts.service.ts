import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { TurnstileService } from "../../common/turnstile.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactStatusDto } from "./dto/update-contact-status.dto";

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly turnstileService: TurnstileService
  ) {}

  async findAll() {
    const contacts = await this.prisma.contactRequest.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    return contacts.map((contact) => ({
      id: contact.id,
      fullName: contact.fullName,
      email: contact.email,
      company: contact.company,
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt.toISOString()
    }));
  }

  async create(payload: CreateContactDto) {
    await this.turnstileService.verify(payload.turnstileToken);

    const contact = await this.prisma.contactRequest.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        company: payload.company,
        message: payload.message
      }
    });

    return {
      id: contact.id,
      status: contact.status,
      submittedAt: contact.createdAt.toISOString()
    };
  }

  async updateStatus(id: string, payload: UpdateContactStatusDto) {
    const contact = await this.prisma.contactRequest.update({
      where: { id },
      data: {
        status: payload.status
      }
    });

    return {
      id: contact.id,
      status: contact.status,
      updatedAt: contact.updatedAt.toISOString()
    };
  }
}
