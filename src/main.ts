import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Defina a origem do seu frontend
    credentials: true, // Permitir credenciais, como cookies ou tokens
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 Isso ativa a conversão automática
    }),
  );

  await app.listen(8081);
}

bootstrap();
