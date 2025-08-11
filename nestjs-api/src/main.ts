import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o ValidationPipe globalmente para validar DTOs automaticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades extras
      transform: true, // Transforma o payload de entrada em uma instância do DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
