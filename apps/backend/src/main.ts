import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS: allow localhost in dev, use FRONTEND_URL in production
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000', 'http://127.0.0.1:3000'] // allow local addresses in dev
      : process.env.FRONTEND_URL || 'http://localhost:3000', // use specified domain in production
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}

bootstrap();
