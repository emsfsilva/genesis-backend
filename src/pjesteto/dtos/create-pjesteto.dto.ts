import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePjesTetoDto {
  @IsNotEmpty()
  nomeVerba: string;

  @IsNumber()
  codVerba: number;

  @IsNumber()
  tetoOf: number;

  @IsNumber()
  tetoPrc: number;

  @IsNumber()
  mes: number;

  @IsNumber()
  ano: number;
}
