import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(username: string, password: string): { username: string, password: string } {
    return { username: username, password: password };
  }
}
