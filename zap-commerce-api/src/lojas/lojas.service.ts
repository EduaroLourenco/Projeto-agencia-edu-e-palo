import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarLojaDto } from './dto';

@Injectable()
export class LojasService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorSlug(slug: string) {
    const loja = await this.prisma.loja.findUnique({
      where: { slug },
      include: { pontosRetirada: true },
    });
    if (!loja) throw new NotFoundException('Loja não encontrada.');
    const { senhaHash: _senhaHash, ...resto } = loja;
    return resto;
  }

  async atualizar(lojaId: string, dto: AtualizarLojaDto) {
    const { pontosRetirada, ...dadosLoja } = dto;

    if (pontosRetirada) {
      await this.prisma.pontoRetirada.deleteMany({ where: { lojaId } });
      await this.prisma.pontoRetirada.createMany({
        data: pontosRetirada.map((p) => ({
          lojaId,
          tipo: p.tipo,
          nome: p.nome,
          descricao: p.descricao,
        })),
      });
    }

    const loja = await this.prisma.loja.update({
      where: { id: lojaId },
      data: dadosLoja,
      include: { pontosRetirada: true },
    });

    const { senhaHash: _senhaHash, ...resto } = loja;
    return resto;
  }
}
