import { Body, Controller, Logger, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  private readonly _logger = new Logger(AuthController.name);

  constructor(
    private readonly _authService: AuthService,
  ) { }

  @Post('register')
  async create(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    return await this._authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return await this._authService.login(loginUserDto);
  }

  @Post('logout')
  async logout(): Promise<void> {
    return this._authService.logout();
  }
}
