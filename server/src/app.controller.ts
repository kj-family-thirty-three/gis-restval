import { Controller, Request, UseGuards, Get, Logger } from '@nestjs/common';
import { AuthService } from './routes/auth/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AppController {
  private readonly _logger = new Logger(AppController.name);

  constructor(
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getProfile(@Request() req) {
    return req.user;
  }
}
