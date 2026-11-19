import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Ticket Triage API')
    .setDescription('Support ticket triage backed by the Python AI service')
    .setVersion('0.1.0')
    .build();
  SwaggerModule.setup('docs', app as any, () =>
    SwaggerModule.createDocument(app as any, config),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
