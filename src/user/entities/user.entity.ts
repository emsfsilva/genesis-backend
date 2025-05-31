import { AddressEntity } from '../../address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { AlunoEntity } from 'src/aluno/entities/aluno.entity';
import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CaEntity } from 'src/ca/entities/ca.entity';
import { ComunicacaoEntity } from 'src/comunicacao/entities/comunicacao.entity';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { CmtciaEntity } from 'src/cmtcia/entities/cmtcia.entity';
import { SubcomEntity } from 'src/subcom/entities/subcom.entity';
import { MasterEntity } from 'src/master/entities/master.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'orgao', nullable: false })
  orgao: string;

  @Column({ name: 'pg', nullable: false })
  pg: string;

  @Column({ name: 'mat', nullable: false })
  mat: number;

  @Column({ name: 'ng', nullable: false })
  nomeGuerra: string;

  @Column({ name: 'funcao', nullable: false })
  funcao: string;

  @Column({
    name: 'type_user',
    nullable: false,
    type: 'enum',
    enum: UserType,
  })
  typeUser: UserType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // REALACIONAMENTOS COM OUTRAS TABELAS

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToOne(() => AlunoEntity, (aluno) => aluno.user)
  aluno?: AlunoEntity;

  @OneToOne(() => MonitorEntity, (monitor) => monitor.user)
  monitor?: MonitorEntity;

  @OneToOne(() => AdmEntity, (adm) => adm.user)
  adm?: AdmEntity;

  @OneToOne(() => CmtciaEntity, (cmtcia) => cmtcia.user)
  cmtcia?: CmtciaEntity;

  @OneToOne(() => CaEntity, (ca) => ca.user)
  ca?: CaEntity;

  @OneToOne(() => SubcomEntity, (subcom) => subcom.user)
  subcom?: SubcomEntity;

  @OneToOne(() => MasterEntity, (master) => master.user)
  master?: MasterEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.useral)
  useral?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usercom)
  usercom?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usercmtcia)
  usercmtcia?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.userca)
  userca?: ComunicacaoEntity;

  @OneToOne(() => ComunicacaoEntity, (comunicacao) => comunicacao.usersubcom)
  usersubcom?: ComunicacaoEntity;

  @OneToOne(
    () => ComunicacaoEntity,
    (comunicacao) => comunicacao.userarquivador,
  )
  userarquivador?: ComunicacaoEntity;
}
