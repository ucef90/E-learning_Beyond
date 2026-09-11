import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../common/prisma.service";
import { tokenHash } from "./password";
export const Public = () => SetMetadata("public", true);
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
export type Identity = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
};
export function cookieToken(req: any): string {
  return (
    (req.headers.cookie || "")
      .split(";")
      .map((v: string) => v.trim())
      .find((v: string) => v.startsWith("be_elearning_session="))
      ?.slice("be_elearning_session=".length) || ""
  );
}
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin;
    const allowedOrigin = process.env.APP_ORIGIN || "http://127.0.0.1:3200";
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      if (
        (origin && origin !== allowedOrigin) ||
        (cookieToken(request) && origin !== allowedOrigin)
      )
        throw new ForbiddenException("Origine de la requête refusée.");
    }
    if (
      this.reflector.getAllAndOverride("public", [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const token = cookieToken(request);
    if (!token || token.length > 256)
      throw new UnauthorizedException("Connectez-vous pour continuer.");
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash: tokenHash(token) },
      include: {
        user: {
          include: { profile: true, roles: { include: { role: true } } },
        },
      },
    });
    if (
      !session ||
      session.expiresAt <= new Date() ||
      session.user.status !== "ACTIVE"
    )
      throw new UnauthorizedException("Votre session a expiré.");
    request.user = {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.profile?.fullName || session.user.email,
      roles: session.user.roles.map((r) => r.role.code),
    };
    const roles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles && !roles.some((r) => request.user.roles.includes(r)))
      throw new ForbiddenException("Droits insuffisants.");
    return true;
  }
}
