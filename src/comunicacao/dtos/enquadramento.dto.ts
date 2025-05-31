import { IsNumber, IsString } from 'class-validator';

export class EnquadramentoDto {
  @IsNumber()
  grauMotivo: number;

  @IsString()
  enquadramento: string;

  @IsString()
  natureza: string;
}
