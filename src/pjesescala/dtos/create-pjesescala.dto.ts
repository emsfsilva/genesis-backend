import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Matches,
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
  @IsNotEmpty()
  dataInicio: string;

  @IsDateString()
  @IsNotEmpty()
  dataFinal: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'horaInicio deve estar no formato HH:mm ou HH:mm:ss',
  })
  horaInicio: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'horaFinal deve estar no formato HH:mm ou HH:mm:ss',
  })
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
  statusOperacao: string;
}
