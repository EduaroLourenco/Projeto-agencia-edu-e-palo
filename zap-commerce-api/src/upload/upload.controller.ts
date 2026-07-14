import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Em produção este endpoint é substituído pelo fluxo de assinatura da
 * Cloudinary descrito na especificação: o front pede uma signature aqui,
 * e o celular do lojista envia a foto direto para a Cloudinary (o backend
 * nunca processa o arquivo). Localmente, para rodar sem nenhuma conta
 * externa, o arquivo fica em /uploads e é servido como estático.
 */
@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const sufixo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${sufixo}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 },
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
    return { imageUrl: `/uploads/${arquivo.filename}` };
  }
}
