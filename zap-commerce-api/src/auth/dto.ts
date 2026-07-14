import { IsString, MinLength } from 'class-validator';

export class RegistrarDto {
  @IsString()
  @MinLength(2)
  slug: string;

  @IsString()
  @MinLength(2)
  nomeLoja: string;

  @IsString()
  @MinLength(8)
  whatsappNumero: string;

  @IsString()
  @MinLength(4)
  senha: string;
}

export class LoginDto {
  @IsString()
  slug: string;

  @IsString()
  senha: string;
}
