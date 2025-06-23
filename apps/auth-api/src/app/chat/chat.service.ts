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
    private authService: AuthService
  ) {}

async createChat(createChatDto: CreateChatDto): Promise<Chat> {
  console.log('[📥] Chat DTO ontvangen:', createChatDto);

  const verifyInput = new VerifyDataDto();
  verifyInput.data = `${createChatDto.chat};${createChatDto.timeStamp}`;
  verifyInput.signature = createChatDto.signature;
  verifyInput.userId = createChatDto.userId;
  verifyInput.streamkey = createChatDto.streamKey;

  console.log('[🔎] Opgebouwd VerifyDataDto:', verifyInput);

  const result = await this.authService.verifyData(verifyInput);

  console.log('[🧪] Resultaat van verifyData:', result);

  if (!result.valid) {
    console.warn('[❌] Signature verification mislukt voor userId:', verifyInput.userId);
    return;
  }

  // 🧠 Haal public key van de user op
  const userPublicKey = await this.authService.getPublicKeyById(createChatDto.userId);

  const chat = this.chatRepository.create({
    ...createChatDto,
    userPublicKey, // ✅ sleutel toevoegen aan chat record
  });

  console.log('[✅] Signature geldig. Bericht wordt opgeslagen.');
  const savedChat = await this.chatRepository.save(chat);
  console.log('[📚] Chat succesvol opgeslagen in database:', savedChat);
  return savedChat;
}


async getChats(
  streamKey: string
): Promise<(Chat & { userPublicKey: string | null; valid: boolean })[]> {
  console.log(`[getChats] Start ophalen van chats voor streamKey: ${streamKey}`);

  const rawChats = await this.chatRepository
    .createQueryBuilder('chat')
    .where('LOWER(chat.streamKey) = LOWER(:streamKey)', { streamKey })
    .select([
      'chat.id',
      'chat.userId',
      'chat.chat',
      'chat.streamKey',
      'chat.signature',
      'chat.timeStamp',
      'chat.createdAt',
      'chat.userPublicKey',
    ])
    .getRawMany();

  console.log(`[getChats] Aantal opgehaalde raw chats: ${rawChats.length}`);
  console.debug(`[getChats] rawChats data:`, rawChats);

  const verifiedChats: (Chat & { userPublicKey: string | null; valid: boolean })[] = [];

  for (const [index, row] of rawChats.entries()) {
    console.log(`[getChats] Verwerken van chat #${index + 1} met ID: ${row.chat_id}`);

    const dataToVerify = `${row.chat_chat};${new Date(row.chat_timeStamp).toISOString()}`;
    const publicKey = row.chat_userPublicKey;

    const verification = publicKey
      ? await this.authService.verifyDataWithPubKey({
          data: dataToVerify,
          signature: row.chat_signature,
          userId: row.chat_userId,
        }, publicKey)
      : { valid: false };

    verifiedChats.push({
      id: row.chat_id,
      userId: row.chat_userId,
      chat: row.chat_chat,
      streamKey: row.chat_streamKey,
      signature: row.chat_signature,
      timeStamp: row.chat_timeStamp,
      createdAt: row.chat_createdAt,
      userPublicKey: publicKey,
      valid: verification.valid,
    });
  }

  console.log(`[getChats] Totaal aantal geverifieerde chats: ${verifiedChats.length}`);
  return verifiedChats;
}




}
