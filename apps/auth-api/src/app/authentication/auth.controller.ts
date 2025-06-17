import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, LoginDto, RegisterDto, VerifyDataDto } from '@dto';
import { createSign } from 'crypto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const result = this.authService.register(username, email, password)
    return new ApiResponse(200, 'registratie succesvol', result);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const result = await this.authService.login(username, password);
    return new ApiResponse(200, 'Login succesvol', result);
  }

  @Get('user/:id/key')
  async returnPublicKey(@Param('id') id: string) {
    const key = await this.authService.getPublicKeyById(+id);
    if (!key) throw new NotFoundException('Publieke sleutel niet gevonden');
    return new ApiResponse(200, 'Publieke sleutel opgehaald', { publicKey: key });
  }

  
  @Post('auth/verify-data')
  async verifyData(@Body() dto: VerifyDataDto) {
    console.log('DTO ontvangen:', dto);
    const result = await this.authService.verifyData(dto);
    return new ApiResponse(200, 'Verificatie uitgevoerd', result);
  }


  @Post('signature')
  async createSignature(@Body() body: { data: string, "priv-key": string }) {
    const data = body.data;
    const privateKey = body['priv-key'];

    const signer = createSign('SHA256');
    signer.update(data);
    signer.end();
    return new ApiResponse(200, 'Digital signature', signer.sign(privateKey, 'base64'));
  }
}
