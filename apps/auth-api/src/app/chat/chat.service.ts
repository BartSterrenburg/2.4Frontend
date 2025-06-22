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

    console.log('[🔎] Opgebouwd VerifyDataDto:', verifyInput);

    const result = await this.authService.verifyData(verifyInput);

    console.log('[🧪] Resultaat van verifyData:', result);
    console.log('[📝] VERIFYING DATA:', verifyInput.data);

    if (!result.valid) {
      console.warn(
        '[❌] Signature verification mislukt voor userId:',
        verifyInput.userId
      );
    } else {
      const chat = this.chatRepository.create(createChatDto);
      console.log('[💾] Chat entity gecreëerd (nog niet opgeslagen):', chat);
      console.log('[✅] Signature geldig. Bericht wordt opgeslagen.');
      const savedChat = await this.chatRepository.save(chat);
      console.log('[📚] Chat succesvol opgeslagen in database:', savedChat);
      return savedChat;
    }
  }

async getChats(
  streamKey: string
): Promise<(Chat & { userPublicKey: string | null; valid: boolean })[]> {
  console.log(`[getChats] Start ophalen van chats voor streamKey: ${streamKey}`);

  const rawChats = await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoin('user', 'user', 'user.id = chat.userId')
    .where('LOWER(chat.streamKey) = LOWER(:streamKey)', { streamKey })
    .select([
      'chat.id',
      'chat.userId',
      'chat.chat',
      'chat.streamKey',
      'chat.signature',
      'chat.timeStamp',
      'chat.createdAt',
      'user.publicKey',
    ])
    .getRawMany();

  console.log(`[getChats] Aantal opgehaalde raw chats: ${rawChats.length}`);
  console.debug(`[getChats] rawChats data:`, rawChats);

  const verifiedChats: (Chat & { userPublicKey: string | null; valid: boolean })[] = [];

  for (const [index, row] of rawChats.entries()) {
    console.log(`[getChats] Verwerken van chat #${index + 1} met ID: ${row.chat_id}`);
    console.debug(`[getChats] Chat inhoud: ${row.chat_chat}`);
    console.debug(`[getChats] Tekenreeks voor verificatie: "${row.chat_chat};${new Date(row.chat_timeStamp).toISOString()}"`);
    console.debug(`[getChats] Handtekening: ${row.chat_signature}`);
    console.debug(`[getChats] User ID: ${row.chat_userId}, publicKey: ${row.user_publicKey}`);

    const dataToVerify = `${row.chat_chat};${new Date(row.chat_timeStamp).toISOString()}`;
    console.log("Belangrijke data: " + dataToVerify);

    const verification = await this.authService.verifyData({
      data: dataToVerify,
      signature: row.chat_signature,
      userId: row.chat_userId,
    });

    console.log(`[getChats] Verificatieresultaat voor chat ID ${row.chat_id}: ${verification.valid}`);

    verifiedChats.push({
      id: row.chat_id,
      userId: row.chat_userId,
      chat: row.chat_chat,
      streamKey: row.chat_streamKey,
      signature: row.chat_signature,
      timeStamp: row.chat_timeStamp,
      createdAt: row.chat_createdAt,
      userPublicKey: row.user_publicKey,
      valid: verification.valid,
    });
  }

  console.log(`[getChats] Totaal aantal geverifieerde chats: ${verifiedChats.length}`);
  return verifiedChats;
}



}
