import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '@entity';
import { CreateChatDto, VerifyDataDto } from '@dto';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private authService: AuthService,
  ) {}

async createChat(createChatDto: CreateChatDto): Promise<Chat> {
  console.log('[📥] Chat DTO ontvangen:', createChatDto);

  const verifyInput = new VerifyDataDto();
  verifyInput.data = `${createChatDto.chat};${createChatDto.timeStamp}`;
  verifyInput.signature = createChatDto.signature;
  verifyInput.userId = createChatDto.userId;

  console.log('[🔎] Opgebouwd VerifyDataDto:', verifyInput);

  const result = await this.authService.verifyData(verifyInput);

  console.log('[🧪] Resultaat van verifyData:', result);
  console.log('[📝] VERIFYING DATA:', verifyInput.data);

  if (!result.valid) {
    console.warn('[❌] Signature verification mislukt voor userId:', verifyInput.userId);
    // Optioneel: return null of throw new UnauthorizedException()
  } else {
    console.log('[✅] Signature geldig. Bericht wordt opgeslagen.');
  }

  const chat = this.chatRepository.create(createChatDto);
  console.log('[💾] Chat entity gecreëerd (nog niet opgeslagen):', chat);

  const savedChat = await this.chatRepository.save(chat);
  console.log('[📚] Chat succesvol opgeslagen in database:', savedChat);

  return savedChat;
}

}
