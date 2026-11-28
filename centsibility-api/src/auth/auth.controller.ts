// auth.controller.ts - receives the login request and passes it to AuthService.
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// All routes in this controller start with /auth.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/v1/auth/login  (public)
  @Post('login')
  // Return 200 OK (POST normally returns 201, but login does not create anything).
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    // The controller only passes the data on. The checking is done in AuthService.
    return this.authService.login(dto);
  }
}
