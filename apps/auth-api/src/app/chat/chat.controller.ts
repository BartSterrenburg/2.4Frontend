import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '@dto';
import { Chat } from '@entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    console.log('Received DTO:', createChatDto);
    // createChatDto.chat = createChatDto.chat + 'manip';
    return this.chatService.createChat(createChatDto);
  }

  @Get(':streamKey')
  async getChats(@Param('streamKey') streamKey: string): Promise<Chat[]> {
    console.log('[📥] Ophalen van chats voor streamKey:', streamKey);
    return await this.chatService.getChats(streamKey);
  }
}
