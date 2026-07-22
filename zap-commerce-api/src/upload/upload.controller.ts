import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const LIMITE_ARQUIVO = 2 * 1024 * 1024; // 2MB — mantém a resposta (base64) dentro
// do limite de payload de funções serverless (Vercel: ~4.5MB).

/**
 * Em produção "de verdade" este endpoint viraria o fluxo de assinatura da
 * Cloudinary: o front pede uma signature aqui, e o celular do lojista envia
 * a foto direto para a Cloudinary (o backend nunca processa o arquivo).
 *
 * Como o back-end roda em função serverless (sem disco persistente), a foto
 * é convertida em base64 e guardada direto na coluna `imageUrl` do produto,
 * no Postgres — zero infraestrutura extra pra rodar. Pra evoluir pra
 * Cloudinary depois, essa é a única função que precisa mudar.
 */
@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: memoryStorage(),
      limits: { fileSize: LIMITE_ARQUIVO },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Envie apenas arquivos de imagem.'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() arquivo: Express.Multer.File) {
    if (!arquivo) throw new BadRequestException('Nenhum arquivo enviado.');
    const base64 = arquivo.buffer.toString('base64');
    return { imageUrl: `data:${arquivo.mimetype};base64,${base64}` };
  }
}
