import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
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
  @Get('user/:id/key')
  async returnPublicKey(@Param('id') id: string) {
    const key = await this.authService.getPublicKeyById(+id);
    if (!key) {
      throw new NotFoundException('Publieke sleutel niet gevonden');
    }
    return { publicKey: key };
  }
  // POST /auth/verify-data	
}
