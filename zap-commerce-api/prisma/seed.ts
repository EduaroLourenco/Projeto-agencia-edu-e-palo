import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TENANT_DEMO = 'bella-atacado';

const IMG = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=70`;

const PRODUTOS = [
  {
    nome: 'Cropped Linho Premium',
    precoVarejo: 49.9,
    precoAtacado: 39.9,
    categorias: ['Novidades', 'Blusas'],
    tamanhosDisponiveis: ['P', 'M', 'G'],
    imageUrl: IMG('photo-1618932260643-eee4a2f652a6'),
    instagramReelsUrl: 'https://www.instagram.com/reel/C8_xyz_example/',
    isUltimasPecas: false,
  },
  {
    nome: 'Saia Envelope Sarja',
    precoVarejo: 69.9,
    precoAtacado: 59.9,
    categorias: ['Novidades', 'Saias'],
    tamanhosDisponiveis: ['P', 'M', 'G', 'GG'],
    imageUrl: IMG('photo-1583496661160-fb5886a13d38'),
    isUltimasPecas: true,
  },
  {
    nome: 'Calça Wide Leg Jeans',
    precoVarejo: 89.9,
    precoAtacado: 74.9,
    categorias: ['Jeans'],
    tamanhosDisponiveis: ['36', '38', '40', '42'],
    imageUrl: IMG('photo-1541099649105-f69ad21f3246'),
    isUltimasPecas: false,
  },
  {
    nome: 'Blusa Tricot Decote V',
    precoVarejo: 54.9,
    precoAtacado: 44.9,
    categorias: ['Blusas'],
    tamanhosDisponiveis: ['P', 'M', 'G'],
    imageUrl: IMG('photo-1554568218-0f1715e72254'),
    isUltimasPecas: false,
  },
  {
    nome: 'Vestido Midi Alfaiataria',
    precoVarejo: 119.9,
    precoAtacado: 99.9,
    categorias: ['Novidades', 'Vestidos'],
    tamanhosDisponiveis: ['P', 'M', 'G'],
    imageUrl: IMG('photo-1595777457583-95e059d581b8'),
    isUltimasPecas: true,
  },
  {
    nome: 'Short Jeans Cintura Alta',
    precoVarejo: 59.9,
    precoAtacado: 47.9,
    categorias: ['Jeans'],
    tamanhosDisponiveis: ['36', '38', '40', '42'],
    imageUrl: IMG('photo-1591195853828-11db59a44f6b'),
    isUltimasPecas: false,
  },
  {
    nome: 'Body Canelado Manga Longa',
    precoVarejo: 44.9,
    precoAtacado: 36.9,
    categorias: ['Blusas', 'Novidades'],
    tamanhosDisponiveis: ['P', 'M', 'G'],
    imageUrl: IMG('photo-1479064555552-3ef4979f8908'),
    isUltimasPecas: false,
  },
  {
    nome: 'Saia Jeans Midi Botões',
    precoVarejo: 74.9,
    precoAtacado: 62.9,
    categorias: ['Jeans', 'Saias'],
    tamanhosDisponiveis: ['36', '38', '40', '42'],
    imageUrl: IMG('photo-1551048632-24e444b48a3e'),
    isUltimasPecas: false,
  },
];

const PONTOS_PADRAO = [
  {
    tipo: 'maos',
    nome: 'Guarda-volumes Box 12 - Rodoviária de Goiânia',
    descricao: 'Retirada de segunda a sábado, das 8h às 18h.',
  },
  {
    tipo: 'excursao',
    nome: 'Excursões de compras (ônibus fretado)',
    descricao: 'Informe o guia e a placa do ônibus da sua cidade.',
  },
  {
    tipo: 'correios',
    nome: 'Transportadora / Correios',
    descricao: 'Frete calculado e combinado no WhatsApp após o pedido.',
  },
];

async function main() {
  const existente = await prisma.loja.findUnique({ where: { slug: TENANT_DEMO } });
  if (existente) {
    console.log('Loja de demonstração já existe, pulando seed.');
    return;
  }

  const senhaHash = await bcrypt.hash('1234', 10);

  const loja = await prisma.loja.create({
    data: {
      slug: TENANT_DEMO,
      nomeLoja: 'Bella Atacado Moda Feminina',
      whatsappNumero: '5562992405383',
      senhaHash,
      regraAtacadoTipo: 'quantidade',
      regraAtacadoMinimo: 6,
      pontosRetirada: { create: PONTOS_PADRAO },
      produtos: {
        create: PRODUTOS.map((p) => ({
          nome: p.nome,
          precoVarejo: p.precoVarejo,
          precoAtacado: p.precoAtacado,
          categoriasJson: JSON.stringify(p.categorias),
          tamanhosJson: JSON.stringify(p.tamanhosDisponiveis),
          imageUrl: p.imageUrl,
          instagramReelsUrl: p.instagramReelsUrl,
          isUltimasPecas: p.isUltimasPecas,
        })),
      },
    },
  });

  console.log(`Loja de demonstração criada: /${loja.slug} (senha: 1234)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
