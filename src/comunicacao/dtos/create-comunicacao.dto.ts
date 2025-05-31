import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateComunicacaoDTO {
  @IsNotEmpty()
  @IsNumber()
  userIdAl: number;

  userIdCom: number;

  @IsNotEmpty()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsNumber()
  grauMotivo: number;

  @IsNotEmpty()
  @IsString()
  descricaoMotivo: string;

  @IsString()
  natureza: string;

  @IsString()
  enquadramento: string;

  // A data será gerenciada diretamente no service, então ela pode ser opcional aqui
  @IsOptional()
  dataCom?: Date;
}
