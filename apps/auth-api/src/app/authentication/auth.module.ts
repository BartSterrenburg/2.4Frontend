import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, VerifyLog, Chat } from '@entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerifyLog, Chat])
],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
