import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { User } from './../../../../../shared/entity/src/lib/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async login(username: string, password: string) {
    const users = await this.userRepository.find();
    console.log('Gevonden gebruikers:', users); // ← CHECK CONNECTIE HIER
    return users;
  }
}
