import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePjesEventoDto {
  @IsString()
  @IsNotEmpty()
  nomedoevento: string;

  @IsNumber()
  OmeId: number;

  @IsNumber()
  ttctof: number;

  @IsNumber()
  ttctprc: number;

  @IsNumber()
  UserId: number;

  @IsString()
  statusevento: string;

  @IsNumber()
  mes: number;

  @IsNumber()
  ano: number;
}
