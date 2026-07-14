import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LojaAtual } from '../auth/loja-atual.decorator';
import type { LojaAutenticada } from '../auth/jwt-auth.guard';
import { AtualizarLojaDto } from './dto';
import { LojasService } from './lojas.service';

@Controller('lojas')
export class LojasController {
  constructor(private readonly lojas: LojasService) {}

  @Get(':slug')
  buscar(@Param('slug') slug: string) {
    return this.lojas.buscarPorSlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  atualizar(@LojaAtual() loja: LojaAutenticada, @Body() dto: AtualizarLojaDto) {
    return this.lojas.atualizar(loja.id, dto);
  }
}
