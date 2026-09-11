import { Controller, Get, Req } from "@nestjs/common";
@Controller("users")
export class UsersController {
  @Get("me") getCurrentUser(@Req() req: any) {
    return req.user;
  }
}
