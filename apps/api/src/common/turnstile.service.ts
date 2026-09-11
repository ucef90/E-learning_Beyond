import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);

  constructor(private readonly configService: ConfigService) {}

  async verify(token?: string) {
    const secretKey = this.configService.get<string>("TURNSTILE_SECRET_KEY");

    if (!secretKey) {
      return;
    }

    if (!token) {
      throw new BadRequestException("Validation anti-spam requise.");
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
      })
    });

    if (!response.ok) {
      this.logger.warn(`Turnstile verification failed with status ${response.status}`);
      throw new BadRequestException("La validation anti-spam n'a pas pu être vérifiée.");
    }

    const result = (await response.json()) as TurnstileResponse;

    if (!result.success) {
      this.logger.warn(`Turnstile rejected request: ${(result["error-codes"] ?? []).join(", ")}`);
      throw new BadRequestException("La validation anti-spam a échoué.");
    }
  }
}
