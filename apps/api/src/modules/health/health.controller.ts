import { Controller, Get } from "@nestjs/common";

import { Public } from "../auth/access";

@Public()
@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "beyond-expertise-api",
      timestamp: new Date().toISOString(),
    };
  }
}
