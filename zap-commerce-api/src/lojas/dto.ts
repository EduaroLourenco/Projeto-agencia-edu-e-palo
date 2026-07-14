import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PontoRetiradaDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsIn(['maos', 'excursao', 'correios'])
  tipo: string;

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}

export class AtualizarLojaDto {
  @IsOptional()
  @IsString()
  nomeLoja?: string;

  @IsOptional()
  @IsBoolean()
  aberto?: boolean;

  @IsOptional()
  @IsString()
  whatsappNumero?: string;

  @IsOptional()
  @IsString()
  mensagemSaudacao?: string;

  @IsOptional()
  @IsIn(['quantidade', 'valor'])
  regraAtacadoTipo?: string;

  @IsOptional()
  @IsNumber()
  regraAtacadoMinimo?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PontoRetiradaDto)
  pontosRetirada?: PontoRetiradaDto[];
}
