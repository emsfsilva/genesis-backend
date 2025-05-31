import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Defina a origem do seu frontend
    credentials: true, // Permitir credenciais, como cookies ou tokens
  });

  await app.listen(8081);
}

bootstrap();
