import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarProdutoDto, CriarProdutoDto } from './dto';

type ProdutoRow = {
  id: string;
  lojaId: string;
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  categoriasJson: string;
  tamanhosJson: string;
  imageUrl: string;
  instagramReelsUrl: string | null;
  isUltimasPecas: boolean;
  isAtivo: boolean;
  criadoEm: Date;
};

function serializarProduto(p: ProdutoRow) {
  return {
    id: p.id,
    tenantId: p.lojaId,
    nome: p.nome,
    precoVarejo: p.precoVarejo,
    precoAtacado: p.precoAtacado,
    categorias: JSON.parse(p.categoriasJson) as string[],
    tamanhosDisponiveis: JSON.parse(p.tamanhosJson) as string[],
    imageUrl: p.imageUrl,
    instagramReelsUrl: p.instagramReelsUrl ?? undefined,
    isUltimasPecas: p.isUltimasPecas,
    isAtivo: p.isAtivo,
    criadoEm: p.criadoEm.getTime(),
  };
}

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async listarPublico(slug: string) {
    const loja = await this.prisma.loja.findUnique({ where: { slug } });
    if (!loja) throw new NotFoundException('Loja não encontrada.');
    const produtos = await this.prisma.produto.findMany({
      where: { lojaId: loja.id, isAtivo: true },
      orderBy: { criadoEm: 'desc' },
    });
    return produtos.map(serializarProduto);
  }

  async listarDoLojista(lojaId: string) {
    const produtos = await this.prisma.produto.findMany({
      where: { lojaId },
      orderBy: { criadoEm: 'desc' },
    });
    return produtos.map(serializarProduto);
  }

  async criar(lojaId: string, dto: CriarProdutoDto) {
    const produto = await this.prisma.produto.create({
      data: {
        lojaId,
        nome: dto.nome,
        precoVarejo: dto.precoVarejo,
        precoAtacado: dto.precoAtacado,
        categoriasJson: JSON.stringify(dto.categorias),
        tamanhosJson: JSON.stringify(dto.tamanhosDisponiveis),
        imageUrl: dto.imageUrl,
        instagramReelsUrl: dto.instagramReelsUrl,
        isUltimasPecas: dto.isUltimasPecas ?? false,
        isAtivo: dto.isAtivo ?? true,
      },
    });
    return serializarProduto(produto);
  }

  async atualizar(lojaId: string, id: string, dto: AtualizarProdutoDto) {
    const existente = await this.prisma.produto.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Produto não encontrado.');
    if (existente.lojaId !== lojaId) throw new ForbiddenException();

    const produto = await this.prisma.produto.update({
      where: { id },
      data: {
        nome: dto.nome,
        precoVarejo: dto.precoVarejo,
        precoAtacado: dto.precoAtacado,
        categoriasJson: dto.categorias ? JSON.stringify(dto.categorias) : undefined,
        tamanhosJson: dto.tamanhosDisponiveis ? JSON.stringify(dto.tamanhosDisponiveis) : undefined,
        imageUrl: dto.imageUrl,
        instagramReelsUrl: dto.instagramReelsUrl,
        isUltimasPecas: dto.isUltimasPecas,
        isAtivo: dto.isAtivo,
      },
    });
    return serializarProduto(produto);
  }

  async excluir(lojaId: string, id: string) {
    const existente = await this.prisma.produto.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Produto não encontrado.');
    if (existente.lojaId !== lojaId) throw new ForbiddenException();

    await this.prisma.produto.delete({ where: { id } });
    return { ok: true };
  }
}
