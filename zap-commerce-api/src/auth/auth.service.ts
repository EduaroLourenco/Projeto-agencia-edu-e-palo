import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegistrarDto } from './dto';

const PONTOS_PADRAO = [
  { tipo: 'maos', nome: 'Retirada na loja', descricao: 'Combine o horário pelo WhatsApp.' },
  {
    tipo: 'excursao',
    nome: 'Excursões de compras (ônibus fretado)',
    descricao: 'Informe o guia e a placa do ônibus.',
  },
  { tipo: 'correios', nome: 'Transportadora / Correios', descricao: 'Frete combinado no chat.' },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private assinarToken(loja: { id: string; slug: string }) {
    return this.jwt.sign({ sub: loja.id, slug: loja.slug });
  }

  async registrar(dto: RegistrarDto) {
    const slug = dto.slug.toLowerCase().trim();
    const existente = await this.prisma.loja.findUnique({ where: { slug } });
    if (existente) {
      throw new ConflictException('Já existe uma loja com essa URL. Escolha outro nome.');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const loja = await this.prisma.loja.create({
      data: {
        slug,
        nomeLoja: dto.nomeLoja.trim(),
        whatsappNumero: dto.whatsappNumero.replace(/\D/g, ''),
        senhaHash,
        pontosRetirada: { create: PONTOS_PADRAO },
      },
      include: { pontosRetirada: true },
    });

    return { token: this.assinarToken(loja), loja: this.serializar(loja) };
  }

  async login(dto: LoginDto) {
    const loja = await this.prisma.loja.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
      include: { pontosRetirada: true },
    });
    if (!loja) throw new UnauthorizedException('Loja ou senha inválidos.');

    const senhaOk = await bcrypt.compare(dto.senha, loja.senhaHash);
    if (!senhaOk) throw new UnauthorizedException('Loja ou senha inválidos.');

    return { token: this.assinarToken(loja), loja: this.serializar(loja) };
  }

  private serializar(loja: { senhaHash: string; [key: string]: unknown }) {
    const { senhaHash: _senhaHash, ...resto } = loja;
    return resto;
  }
}
