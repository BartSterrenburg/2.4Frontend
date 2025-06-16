import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@shared/dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  // POST /auth/verify-data
  // GET /auth/public-key/:id
  // POST /auth/verify-data	
}
