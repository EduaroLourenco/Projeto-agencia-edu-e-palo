import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CriarProdutoDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsNumber()
  precoVarejo: number;

  @IsNumber()
  precoAtacado: number;

  @IsArray()
  @IsString({ each: true })
  categorias: string[];

  @IsArray()
  @IsString({ each: true })
  tamanhosDisponiveis: string[];

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  instagramReelsUrl?: string;

  @IsOptional()
  @IsBoolean()
  isUltimasPecas?: boolean;

  @IsOptional()
  @IsBoolean()
  isAtivo?: boolean;
}

export class AtualizarProdutoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @IsOptional()
  @IsNumber()
  precoVarejo?: number;

  @IsOptional()
  @IsNumber()
  precoAtacado?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categorias?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tamanhosDisponiveis?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  instagramReelsUrl?: string;

  @IsOptional()
  @IsBoolean()
  isUltimasPecas?: boolean;

  @IsOptional()
  @IsBoolean()
  isAtivo?: boolean;
}
