import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePjesEventoDto {
  @IsString()
  @IsNotEmpty()
  nomeEvento: string;

  @IsNumber()
  omeId: number;

  @IsNumber()
  ttCtOf: number;

  @IsNumber()
  ttCtPrc: number;

  @IsNumber()
  userId: number;

  @IsString()
  statusEvento: string;

  @IsNumber()
  mes: number;

  @IsNumber()
  ano: number;
}
