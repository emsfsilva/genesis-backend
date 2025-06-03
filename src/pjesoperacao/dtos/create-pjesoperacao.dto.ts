import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePjesOperacaoDto {
  @IsString()
  @IsNotEmpty()
  nomeOperacao: string;

  @IsNumber()
  omeId: number;

  @IsNumber()
  pjesEventoId: number;

  @IsNumber()
  ttCtOfDist: number;

  @IsNumber()
  ttCtPrcDist: number;

  @IsNumber()
  ttCtOfExe: number;

  @IsNumber()
  ttCtPrcExe: number;

  @IsNumber()
  UserId: number;

  @IsString()
  statusOperacao: string;

  @IsNumber()
  mes: number;

  @IsNumber()
  ano: number;
}
