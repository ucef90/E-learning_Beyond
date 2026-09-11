import { Body, Controller, Post, Get, Req, Res } from "@nestjs/common";
import { IsString, MinLength, MaxLength } from "class-validator";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public, cookieToken } from "./access";
class ResetDto {
  @IsString() @MinLength(32) @MaxLength(256) token!: string;
  @IsString() @MinLength(12) @MaxLength(128) password!: string;
}
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post("register")
  async register(@Body() body: RegisterDto, @Req() req: any) {
    await this.authService.throttle(`register:${req.ip}`, 5);
    return this.authService.register(body);
  }
  @Public()
  @Post("login")
  async login(
    @Body() body: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body, req.ip);
    res.cookie("be_elearning_session", result.token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.COOKIE_SECURE === "true",
      path: "/",
      maxAge: 8 * 3600000,
    });
    return { user: result.user };
  }
  @Get("me") me(@Req() req: any) {
    return req.user;
  }
  @Post("logout") async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(cookieToken(req));
    res.clearCookie("be_elearning_session", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.COOKIE_SECURE === "true",
    });
    return result;
  }
  @Public() @Post("reset") async reset(
    @Body() body: ResetDto,
    @Req() req: any,
  ) {
    await this.authService.throttle(`reset:${req.ip}`);
    return this.authService.reset(body.token, body.password);
  }
}
