import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { LojaAutenticada } from './jwt-auth.guard';

export const LojaAtual = createParamDecorator((_: unknown, ctx: ExecutionContext): LojaAutenticada => {
  const req = ctx.switchToHttp().getRequest<Request & { loja: LojaAutenticada }>();
  return req.loja;
});
