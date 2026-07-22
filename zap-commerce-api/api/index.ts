import 'dotenv/config';
import type { Request, Response } from 'express';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createApp } from '../src/create-app';

// A função serverless "esfria" entre invocações — cachear a instância evita
// recriar o app Nest inteiro (e reabrir conexão com o banco) a cada request
// quando a mesma instância do runtime é reaproveitada.
const server = express();
let bootstrapPromise: Promise<void> | null = null;

async function ensureBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const app = await createApp(new ExpressAdapter(server));
      await app.init();
    })();
  }
  return bootstrapPromise;
}

export default async function handler(req: Request, res: Response) {
  await ensureBootstrapped();
  server(req, res);
}
