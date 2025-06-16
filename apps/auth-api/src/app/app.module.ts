import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
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
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
