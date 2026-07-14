import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LojasController } from './lojas.controller';
import { LojasService } from './lojas.service';

@Module({
  imports: [AuthModule],
  controllers: [LojasController],
  providers: [LojasService],
})
export class LojasModule {}
