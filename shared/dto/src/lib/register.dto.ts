import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @MinLength(8, { message: 'Wachtwoord moet minstens 8 tekens lang zijn' })
  password?: string;
}
