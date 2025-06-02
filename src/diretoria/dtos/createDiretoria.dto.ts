import { IsString, IsNumber } from 'class-validator';

export class CreateDiretoriaDto {
  @IsNumber()
  id: number;

  @IsString()
  nomeDiretoria: string;
}
