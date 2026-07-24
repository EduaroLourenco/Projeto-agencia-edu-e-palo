import 'dotenv/config';
import type { Express, Request, Response } from 'express';
import { createApp } from '../src/create-app';

// A função serverless "esfria" entre invocações — cachear a instância evita
// recriar o app Nest inteiro (e reabrir conexão com o banco) a cada request
// quando a mesma instância do runtime é reaproveitada.
//
// A instância do Express usada aqui vem do próprio Nest (getHttpAdapter().getInstance()),
// em vez de criada manualmente com `express()` — isso evita um conflito de versão entre
// o express declarado neste projeto e a cópia que o @nestjs/platform-express usa internamente,
// que quebrava com "'app.router' is deprecated!" ao rodar como função serverless.
let serverPromise: Promise<Express> | null = null;

async function getServer() {
  if (!serverPromise) {
    serverPromise = (async () => {
      const app = await createApp();
      await app.init();
      return app.getHttpAdapter().getInstance();
    })();
  }
  return serverPromise;
}

export default async function handler(req: Request, res: Response) {
  const server = await getServer();
  server(req, res);
}
