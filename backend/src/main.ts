import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@dungeon-maister/shared';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  Logger.info(`[server]: NestJS application is running on port ${PORT}`);
}
bootstrap();
