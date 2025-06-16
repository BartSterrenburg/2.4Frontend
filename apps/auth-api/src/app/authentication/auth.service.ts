import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, VerifyLog } from '@entity';
import { VerifyDataDto } from '@dto';
import { createVerify, generateKeyPairSync } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VerifyLog)
    private verifyLogRepository: Repository<VerifyLog>,
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


async verifyData(dto: VerifyDataDto) {
  const user = await this.userRepository.findOne({ where: { id: dto.userId } });

  const log = this.verifyLogRepository.create({
    userId: dto.userId,
    data: dto.data,
    signature: dto.signature,
    publicKeyUsed: user?.publicKey ?? null,
    result: 'invalid',
  });

  if (!user || !user.publicKey) {
    log.reason = 'Geen gebruiker of publieke sleutel gevonden';
    await this.verifyLogRepository.save(log);
    return { valid: false };
  }

  try {
    const verifier = createVerify('SHA256');
    verifier.update(dto.data);
    verifier.end();

    const isValid = verifier.verify(user.publicKey, Buffer.from(dto.signature, 'base64'));

    log.result = isValid ? 'valid' : 'invalid';
    if (!isValid) log.reason = 'Signature mismatch';

    await this.verifyLogRepository.save(log);
    return { valid: isValid };
  } catch (err) {
    log.reason = err.message;
    await this.verifyLogRepository.save(log);
    return { valid: false };
  }
}


  async getPublicKeyById(userId: number): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user?.publicKey || null;
  }

}
