import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

/** Configuração compartilhada entre o servidor local (main.ts) e o handler serverless (api/index.ts). */
export async function createApp(adapter?: ExpressAdapter): Promise<NestExpressApplication> {
  const app = adapter
    ? await NestFactory.create<NestExpressApplication>(AppModule, adapter)
    : await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  return app;
}
