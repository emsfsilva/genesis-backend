import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comunicacao' })
export class ComunicacaoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  // DADOS DO COMUNCANTE
  @Column({ name: 'user_id_com', nullable: false })
  userIdCom: number;

  @Column({ name: 'motivo', nullable: false })
  motivo: string;

  @Column({ name: 'grau_motivo', type: 'float', nullable: true })
  grauMotivo: number;

  @Column({ name: 'enquadramento', nullable: true })
  enquadramento: string;

  @Column({ name: 'descricao_motivo', nullable: false })
  descricaoMotivo: string;

  @Column({ name: 'natureza', nullable: true })
  natureza: string;

  @CreateDateColumn({ name: 'data_com' })
  dataCom: Date;

  // DADOS DO ALUNO
  @Column({ name: 'user_id_al', nullable: false })
  userIdAl: number;

  @Column({ name: 'resposta', nullable: true })
  resposta: string;

  @CreateDateColumn({ name: 'data_resp' })
  dataResp: Date;

  // DADOS DO CMT DA CIA

  @Column({ name: 'user_id_cmtcia', nullable: true })
  userIdCmtCia: number;

  @Column({ name: 'parecer_cmt_cia', nullable: true })
  parecerCmtCia: string;

  @CreateDateColumn({ name: 'data_parecer_cmt_cia' })
  dataParecerCmtCia: Date;

  // DADOS DO CMT DO CA

  @Column({ name: 'user_id_ca', nullable: true })
  userIdCa: number;

  @Column({ name: 'parecer_ca', nullable: true })
  parecerCa: string;

  @CreateDateColumn({ name: 'data_parecer_ca' })
  dataParecerCa: Date;

  // DADOS DO SUBCOMANDO

  @Column({ name: 'user_id_subcom', nullable: true })
  userIdSubcom: number;

  @Column({ name: 'parecer_subcom', nullable: true })
  parecerSubcom: string;

  @CreateDateColumn({ name: 'data_parecer_subcom' })
  dataParecerSubcom: Date;

  // STATUS DA COMUNICAÇÃO

  @Column({ name: 'status', nullable: false })
  status: string;

  @Column({ name: 'dtatualizacaostatus' })
  dtAtualizacaoStatus: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // DADOS DO ARQUIVAMENTO DA COMUNICAÇÃO
  @Column({ name: 'motivo_arquivamento', type: 'text', nullable: true })
  motivoArquivamento: string;

  @Column({ name: 'user_id_arquivamento', type: 'int', nullable: true })
  userIdArquivamento: number;

  //RELACIONAMENTOS OM OUTRAS TABELAS

  @OneToOne(() => UserEntity, (user) => user.useral)
  @JoinColumn({ name: 'user_id_al', referencedColumnName: 'id' })
  useral?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.usercom)
  @JoinColumn({ name: 'user_id_com', referencedColumnName: 'id' })
  usercom?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.usercmtcia)
  @JoinColumn({ name: 'user_id_cmtcia', referencedColumnName: 'id' })
  usercmtcia?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.userca)
  @JoinColumn({ name: 'user_id_ca', referencedColumnName: 'id' })
  userca?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.usersubcom)
  @JoinColumn({ name: 'user_id_subcom', referencedColumnName: 'id' })
  usersubcom?: UserEntity;

  @OneToOne(() => UserEntity, (user) => user.userarquivador)
  @JoinColumn({ name: 'user_id_arquivamento', referencedColumnName: 'id' })
  userarquivador?: UserEntity;
}
