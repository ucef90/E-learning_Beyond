import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { TurnstileService } from "./turnstile.service";

@Global()
@Module({
  providers: [PrismaService, TurnstileService],
  exports: [PrismaService, TurnstileService]
})
export class PrismaModule {}
