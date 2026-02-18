import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS: в dev разрешаем localhost и все origins, в production только указанный FRONTEND_URL
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000', 'http://127.0.0.1:3000'] // в dev разрешаем локальные адреса
      : process.env.FRONTEND_URL || 'http://localhost:3000', // в production только указанный домен
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}

bootstrap();
