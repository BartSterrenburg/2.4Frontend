import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entity';
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || user.password !== password) {
      throw new Error('Ongeldige gebruikersnaam of wachtwoord');
    }

    // Genereer nieuw RSA sleutel-paar
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Sla publieke sleutel op bij gebruiker
    user.publicKey = publicKey;
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Return private key aan de client
    return {
      message: 'Login succesvol',
      privateKey,
    };
  }
}
