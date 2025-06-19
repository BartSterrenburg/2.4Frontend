import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from '@dto';
import { Chat } from '@entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    console.log('Received DTO:', createChatDto);
    return this.chatService.createChat(createChatDto);
  }
}
