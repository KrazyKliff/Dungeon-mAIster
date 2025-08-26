import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`[server]: NestJS application is running on port ${PORT}`);
}
bootstrap();
