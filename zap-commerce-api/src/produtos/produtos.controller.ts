import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LojaAtual } from '../auth/loja-atual.decorator';
import type { LojaAutenticada } from '../auth/jwt-auth.guard';
import { AtualizarProdutoDto, CriarProdutoDto } from './dto';
import { ProdutosService } from './produtos.service';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtos: ProdutosService) {}

  @Get('loja/:slug')
  listarPublico(@Param('slug') slug: string) {
    return this.produtos.listarPublico(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  listarDoLojista(@LojaAtual() loja: LojaAutenticada) {
    return this.produtos.listarDoLojista(loja.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  criar(@LojaAtual() loja: LojaAutenticada, @Body() dto: CriarProdutoDto) {
    return this.produtos.criar(loja.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  atualizar(
    @LojaAtual() loja: LojaAutenticada,
    @Param('id') id: string,
    @Body() dto: AtualizarProdutoDto,
  ) {
    return this.produtos.atualizar(loja.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  excluir(@LojaAtual() loja: LojaAutenticada, @Param('id') id: string) {
    return this.produtos.excluir(loja.id, id);
  }
}
