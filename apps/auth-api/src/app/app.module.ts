import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamModule } from './stream/stream.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Secret123',
      database: 'TheCircleAuth',
      autoLoadEntities: true,
      synchronize: true,
      options: {
        encrypt: false, 
        trustServerCertificate: true
      }
    }),
    AuthModule,
    StreamModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
