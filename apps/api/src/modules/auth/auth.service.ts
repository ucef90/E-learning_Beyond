import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  HttpException,
} from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../../common/prisma.service";
import { hashPassword, verifyPassword, tokenHash } from "./password";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async throttle(key: string, limit = 10) {
    const window = Math.floor(Date.now() / 900000);
    const hash = tokenHash(`${key}:${window}`);
    const row = await this.prisma.authThrottle.upsert({
      where: { key: hash },
      create: {
        key: hash,
        count: 1,
        expiresAt: new Date((window + 1) * 900000),
      },
      update: { count: { increment: 1 } },
    });
    if (row.count > limit)
      throw new HttpException(
        "Trop de tentatives. Réessayez dans quinze minutes.",
        429,
      );
  }
  async register(payload: RegisterDto) {
    const email = payload.email.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } }))
      throw new BadRequestException(
        "Création impossible. Utilisez la récupération d’accès si nécessaire.",
      );
    const role = await this.prisma.role.upsert({
      where: { code: "LEARNER" },
      create: { code: "LEARNER", label: "Stagiaire" },
      update: {},
    });
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(payload.password),
        profile: {
          create: {
            fullName: payload.fullName,
            companyName: payload.companyName,
          },
        },
        roles: { create: { roleId: role.id } },
      },
    });
    return {
      message:
        "Compte créé. L’accès à un module nécessite une attribution par l’organisme.",
      user: { id: user.id, email },
    };
  }
  async login(payload: LoginDto, ip: string) {
    const email = payload.email.trim().toLowerCase();
    await this.throttle(`ip:${ip}`, 50);
    await this.throttle(`login:${email}`);
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } }, profile: true },
    });
    const valid = await verifyPassword(payload.password, user?.passwordHash);
    if (!valid || !user || user.status !== "ACTIVE")
      throw new UnauthorizedException("Adresse ou mot de passe incorrect.");
    const token = randomBytes(32).toString("hex");
    await this.prisma.authSession.create({
      data: {
        tokenHash: tokenHash(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + 8 * 3600000),
      },
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.profile?.fullName,
        roles: user.roles.map((r) => r.role.code),
      },
    };
  }
  async logout(token: string) {
    await this.prisma.authSession.deleteMany({
      where: { tokenHash: tokenHash(token) },
    });
    return { message: "Session fermée." };
  }
  async reset(token: string, password: string) {
    const record = await this.prisma.passwordReset.findUnique({
      where: { tokenHash: tokenHash(token) },
    });
    if (!record || record.usedAt || record.expiresAt < new Date())
      throw new BadRequestException("Lien expiré ou déjà utilisé.");
    const passwordHash = await hashPassword(password);
    await this.prisma.$transaction(async (tx) => {
      const claim = await tx.passwordReset.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claim.count !== 1)
        throw new BadRequestException("Lien expiré ou déjà utilisé.");
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash, status: "ACTIVE" },
      });
      await tx.authSession.deleteMany({ where: { userId: record.userId } });
      await tx.passwordReset.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      });
    });
    return { message: "Mot de passe enregistré. Reconnectez-vous." };
  }
}
