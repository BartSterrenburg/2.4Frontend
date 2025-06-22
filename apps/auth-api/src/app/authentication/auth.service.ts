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

  async register(username: string, email: string, password: string) {
    const user = new User();
    user.username = username;
    user.email = email;
    user.setPassword(password);
    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      username: saved.username,
      email: saved.email,
      createdAt: saved.createdAt,
    };
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!(await user.validatePassword(password))) {
      throw new Error('Ongeldige gebruikersnaam of wachtwoord');
    }

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

    user.publicKey = publicKey;
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return {
      message: 'Login succesvol',
      userId: user.id,
      privateKey,
    };
  }

  async verifyData(dto: VerifyDataDto) {
    console.log('[📥] DTO ontvangen voor verificatie:', dto);

    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    console.log('[👤] Gebruiker opgehaald uit DB:', user);

    const log = this.verifyLogRepository.create({
      userId: dto.userId,
      data: dto.data,
      signature: dto.signature,
      publicKeyUsed: user?.publicKey ?? null,
      result: 'invalid',
    });

    if (!user || !user.publicKey) {
      console.warn('[⚠️] Geen gebruiker of public key gevonden voor ID:', dto.userId);
      log.reason = 'Geen gebruiker of publieke sleutel gevonden';
      await this.verifyLogRepository.save(log);
      return { valid: false };
    }

    console.log('[🔑] Public key van gebruiker (eerste 100 tekens):', user.publicKey.slice(0, 100), '...');
    console.log('[📝] Data die geverifieerd wordt:', dto.data);
    console.log('[📦] Signature (base64):', dto.signature);

    try {
      const verifier = createVerify('SHA256');

      const dataBuffer = Buffer.from(dto.data, 'utf8');
      const signatureBuffer = Buffer.from(dto.signature, 'base64'); // ✅ Correctie hier

      console.log('[🔣] DataBuffer (UTF-8):', dataBuffer.toString('hex').slice(0, 100), '...');
      console.log('[🔏] SignatureBuffer (base64 -> binary):', signatureBuffer.toString('hex').slice(0, 100), '...');

      verifier.update(dataBuffer);
      verifier.end();

      const isValid = verifier.verify(user.publicKey, signatureBuffer);

      console.log(`[✅] Verificatieresultaat voor userId ${dto.userId}:`, isValid);

      log.result = isValid ? 'valid' : 'invalid';
      if (!isValid) log.reason = 'Signature mismatch';

      await this.verifyLogRepository.save(log);
      return { valid: isValid };
    } catch (err) {
      console.error('[🔥] Fout tijdens verify():', err);
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
