import { PrismaService } from "./common/prisma.service";
import { productionChecks } from "./common/production-checks";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: "2mb" }));
  app.use((_req: any, res: any, next: any) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });

  app.getHttpAdapter().getInstance().set("trust proxy", "loopback");
  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: process.env.APP_ORIGIN || "http://127.0.0.1:3200",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 4000;
  if (
    process.env.NODE_ENV === "production" &&
    process.env.COOKIE_SECURE !== "true"
  )
    throw new Error("COOKIE_SECURE=true requis en production HTTPS.");
  await productionChecks(app.get(PrismaService));
  await app.listen(port, process.env.BIND_HOST || "127.0.0.1");
}

bootstrap();
