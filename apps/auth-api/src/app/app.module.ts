import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamModule } from './stream/stream.module';


@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'mssql',
      host: '145.49.25.193',
      port: 1433,
      username: 'sa',
      password: 'Bart2005!',
      database: 'TheCircleAuth',
      autoLoadEntities: true,
      synchronize: true,
      options: {
        encrypt: false, 
        trustServerCertificate: true
      }
    }),
    AuthModule,
    StreamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
