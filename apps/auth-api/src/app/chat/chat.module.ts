import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, VerifyLog, Chat } from '@entity';
import { AuthService } from '../authentication/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerifyLog, Chat])
],
  controllers: [ChatController],
  providers: [ChatService, AuthService],
  exports: [TypeOrmModule],
})
export class ChatModule {}
