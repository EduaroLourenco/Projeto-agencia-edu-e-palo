import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LojasModule } from './lojas/lojas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './produtos/produtos.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Limite geral (o storage em memória do throttler é por instância — em
    // serverless cada função "fria" começa com contador zerado, mas ainda barra
    // abuso automatizado sustentado dentro de uma mesma instância aquecida).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    LojasModule,
    ProdutosModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
