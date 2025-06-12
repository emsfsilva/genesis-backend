import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Matches,
  IsDate,
  Length,
} from 'class-validator';

export class CreatePjesEscalaDto {
  @IsNumber()
  @IsNotEmpty()
  pjesEventoId: number;

  @IsNumber()
  @IsNotEmpty()
  pjesOperacaoId: number;

  @IsNumber()
  @IsNotEmpty()
  omeId: number;

  @IsString()
  @IsNotEmpty()
  pgSgp: string;

  @IsNumber()
  @IsNotEmpty()
  matSgp: number;

  @IsString()
  @IsNotEmpty()
  nomeGuerraSgp: string;

  @IsString()
  @IsNotEmpty()
  nomeCompletoSgp: string;

  @IsNumber()
  @IsNotEmpty()
  omeSgp: number;

  @IsString()
  @Length(1, 1)
  tipoSgp: string;

  @IsNumber()
  @IsNotEmpty()
  nunfuncSgp: number;

  @IsNumber()
  @IsNotEmpty()
  nunvincSgp: number;

  @IsString()
  @IsNotEmpty()
  situacaoSgp: string;

  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  dataFinal: Date;

  @IsString()
  @Length(1, 5)
  horaInicio: string;

  @IsString()
  @Length(1, 5)
  horaFinal: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  localApresentacao?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  statusEscala: string;
}
