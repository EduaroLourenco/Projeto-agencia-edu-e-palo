import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LojasModule } from './lojas/lojas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './produtos/produtos.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, AuthModule, LojasModule, ProdutosModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
