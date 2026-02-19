import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS: allow localhost in dev, use FRONTEND_URL in production
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev
      ? ['http://localhost:3301', 'http://127.0.0.1:3301'] // allow local addresses in dev
      : process.env.FRONTEND_URL || 'http://localhost:3301', // use specified domain in production
    credentials: true,
  });

  const port = process.env.PORT || 3300;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
}

bootstrap();
