import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, VerifyLog } from '@entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerifyLog])
],
  controllers: [StreamController],
  providers: [StreamService],
  exports: [TypeOrmModule],
})
export class StreamModule {}
