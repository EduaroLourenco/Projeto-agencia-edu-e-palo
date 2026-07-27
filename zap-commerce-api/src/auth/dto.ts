import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegistrarDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug deve conter apenas letras minúsculas, números e hífen.',
  })
  slug: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nomeLoja: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  whatsappNumero: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  senha: string;
}

export class LoginDto {
  @IsString()
  @MaxLength(60)
  slug: string;

  @IsString()
  @MaxLength(72)
  senha: string;
}
