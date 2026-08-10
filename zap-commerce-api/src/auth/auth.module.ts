import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

// Sem fallback: um segredo hardcoded neste arquivo público permitiria forjar
// token válido pra qualquer loja caso JWT_SECRET não seja configurado em algum
// ambiente. Falhar no boot é preferível a servir requisições com uma chave conhecida.
if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET não configurado. Defina essa variável de ambiente antes de iniciar a API (veja .env.example).',
  );
}

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
