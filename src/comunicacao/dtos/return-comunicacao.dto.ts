import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ComunicacaoEntity } from '../entities/comunicacao.entity';
import { ReturnUserDto } from 'src/user/dtos/returnUser.dto';

export class ReturnComunicacaoDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  userIdCom: number;

  @IsString()
  motivo: string;

  @IsOptional()
  @IsNumber()
  grauMotivo: number;

  @IsString()
  descricaoMotivo: string;

  @IsString()
  natureza: string;

  @IsOptional()
  @IsString()
  enquadramento: string;

  @IsOptional()
  @IsString()
  dataCom: string;

  @IsNumber()
  userIdAl: number;

  @IsOptional()
  @IsString()
  resposta?: string;

  @IsOptional()
  @IsString()
  dataResp?: string;

  @IsOptional()
  @IsNumber()
  userIdCmtCia?: number;

  @IsOptional()
  @IsString()
  parecerCmtCia?: string;

  @IsOptional()
  @IsString()
  dataParecerCmtCia?: string;

  @IsOptional()
  @IsNumber()
  userIdCa?: number;

  @IsOptional()
  @IsString()
  parecerCa?: string;

  @IsOptional()
  @IsString()
  dataParecerCa?: string;

  @IsOptional()
  @IsNumber()
  userIdSubcom?: number;

  @IsOptional()
  @IsString()
  parecerSubcom?: string;

  @IsOptional()
  @IsString()
  dataParecerSubcom?: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  dtAtualizacaoStatus: string;

  @IsOptional()
  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsNumber()
  userIdArquivamento?: number;

  @IsOptional()
  @IsString()
  motivoArquivamento?: string;

  useral?: ReturnUserDto;
  usercom?: ReturnUserDto;
  usercmtcia?: ReturnUserDto;
  userca?: ReturnUserDto;
  usersubcom?: ReturnUserDto;

  @IsOptional()
  userarquivador?: ReturnUserDto;

  constructor(comunicacaoEntity: ComunicacaoEntity) {
    if (!comunicacaoEntity) {
      throw new Error('ComunicacaoEntity não pode ser nula');
    }

    this.id = comunicacaoEntity.id;
    this.userIdCom = comunicacaoEntity.userIdCom;
    this.motivo = comunicacaoEntity.motivo;
    this.grauMotivo = comunicacaoEntity.grauMotivo;
    this.descricaoMotivo = comunicacaoEntity.descricaoMotivo;
    this.natureza = comunicacaoEntity.natureza;
    this.enquadramento = comunicacaoEntity.enquadramento;
    this.dataCom = comunicacaoEntity.dataCom
      ? comunicacaoEntity.dataCom.toISOString()
      : null;
    this.userIdAl = comunicacaoEntity.userIdAl;
    this.resposta = comunicacaoEntity.resposta;
    this.dataResp = comunicacaoEntity.dataResp
      ? comunicacaoEntity.dataResp.toISOString()
      : null;

    this.userIdCmtCia = comunicacaoEntity.userIdCmtCia;
    this.parecerCmtCia = comunicacaoEntity.parecerCmtCia;
    this.dataParecerCmtCia = comunicacaoEntity.dataParecerCmtCia
      ? comunicacaoEntity.dataParecerCmtCia.toISOString()
      : null;

    this.userIdCa = comunicacaoEntity.userIdCa;
    this.parecerCa = comunicacaoEntity.parecerCa;
    this.dataParecerCa = comunicacaoEntity.dataParecerCa
      ? comunicacaoEntity.dataParecerCa.toISOString()
      : null;

    this.userIdSubcom = comunicacaoEntity.userIdSubcom;
    this.parecerSubcom = comunicacaoEntity.parecerSubcom;
    this.dataParecerSubcom = comunicacaoEntity.dataParecerSubcom
      ? comunicacaoEntity.dataParecerSubcom.toISOString()
      : null;

    this.status = comunicacaoEntity.status;
    this.dtAtualizacaoStatus =
      comunicacaoEntity.dtAtualizacaoStatus.toISOString();
    this.createdAt = comunicacaoEntity.createdAt.toISOString();
    this.updatedAt = comunicacaoEntity.updatedAt.toISOString();

    this.userIdArquivamento = comunicacaoEntity.userIdArquivamento;

    this.userarquivador = comunicacaoEntity.userarquivador
      ? new ReturnUserDto(comunicacaoEntity.userarquivador)
      : undefined;

    this.motivoArquivamento = comunicacaoEntity.motivoArquivamento;

    // Mapear o usuário associado ao aluno
    if (comunicacaoEntity.useral) {
      const grauAtual = comunicacaoEntity.useral?.aluno
        ? (comunicacaoEntity.useral.aluno as any).grauAtual
        : undefined;

      this.useral = new ReturnUserDto(comunicacaoEntity.useral, grauAtual);
    }

    // Mapear o usuário associado ao comunicante
    this.usercom = comunicacaoEntity.usercom
      ? new ReturnUserDto(comunicacaoEntity.usercom)
      : undefined;

    // Mapear o usuário associado ao cmt da cia
    this.usercmtcia = comunicacaoEntity.usercmtcia
      ? new ReturnUserDto(comunicacaoEntity.usercmtcia)
      : undefined;

    // Mapear o usuário associado ao cmt do ca
    this.userca = comunicacaoEntity.userca
      ? new ReturnUserDto(comunicacaoEntity.userca)
      : undefined;

    // Mapear o usuário associado ao subcomando
    this.usersubcom = comunicacaoEntity.usersubcom
      ? new ReturnUserDto(comunicacaoEntity.usersubcom)
      : undefined;
  }
}
