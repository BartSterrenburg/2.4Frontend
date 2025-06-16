import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LoginDto } from './../../../../../libs/shared/dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }
}
