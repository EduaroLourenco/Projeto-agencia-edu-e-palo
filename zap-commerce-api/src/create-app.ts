import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

// Acomoda a foto de produto em base64 (até 2MB brutos ≈ 2.7MB em base64) enviada
// dentro do corpo JSON de POST/PUT /produtos, com folga, e ainda fica abaixo do
// limite de payload de função serverless do Vercel (~4.5MB).
const LIMITE_PAYLOAD = '4mb';

const ORIGENS_PADRAO = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://agenciadigitalsigma.vercel.app',
  'https://projeto-agencia-edu-e-palo-focn.vercel.app',
];

/** Restringe o CORS aos front-ends conhecidos, em vez de refletir qualquer origem. */
function origemPermitida(origin: string): boolean {
  const extras =
    process.env.ALLOWED_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  if (ORIGENS_PADRAO.includes(origin) || extras.includes(origin)) return true;

  try {
    // Deploys de preview do Vercel (URL única por build) — mesmo projeto, domínio muda a cada deploy.
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

/** Configuração compartilhada entre o servidor local (main.ts) e o handler serverless (api/index.ts). */
export async function createApp(adapter?: ExpressAdapter): Promise<NestExpressApplication> {
  const app = adapter
    ? await NestFactory.create<NestExpressApplication>(AppModule, adapter)
    : await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(json({ limit: LIMITE_PAYLOAD }));
  app.use(urlencoded({ extended: true, limit: LIMITE_PAYLOAD }));

  app.enableCors({
    origin(origin, callback) {
      // Sem header Origin (curl, chamada servidor-a-servidor, healthcheck) — permite.
      if (!origin || origemPermitida(origin)) return callback(null, true);
      callback(new Error('Não permitido pelo CORS.'), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  return app;
}
