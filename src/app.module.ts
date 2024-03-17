/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule,ConfigModule.forRoot({ envFilePath: ['.env']})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
