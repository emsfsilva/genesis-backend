import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesescala' })
export class PjesEscalaEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'pjeseventoid', nullable: false })
  pjesEventoId: number;

  @Column({ name: 'pjesoperacaoid', nullable: false })
  pjesOperacaoId: number;

  @Column({ name: 'omeid', nullable: false })
  omeId: number;

  @Column({ name: 'pgsgp', nullable: false })
  pgSgp: string;

  @Column({ name: 'matsgp', nullable: false })
  matSgp: number;

  @Column({ name: 'ngsgp', nullable: false })
  nomeGuerraSgp: string;

  @Column({ name: 'nomecompletosgp', nullable: false })
  nomeCompletoSgp: string;

  @Column({ name: 'omesgp', nullable: false })
  omeSgp: number;

  @Column({ name: 'nunfuncsgp', nullable: false })
  nunfuncSgp: number;

  @Column({ name: 'nunvincsgp', nullable: false })
  nunvincSgp: number;

  @Column({ name: 'situacaosgp', nullable: false })
  situacaoSgp: string;

  @Column({ name: 'datainicio', type: 'date', nullable: false })
  dataInicio: Date;

  @Column({ name: 'datafinal', type: 'date', nullable: false })
  dataFinal: Date;

  @Column({ name: 'horainicio', type: 'time', nullable: false })
  horaInicio: string;

  @Column({ name: 'horafinal', type: 'time', nullable: false })
  horaFinal: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'localapresentacao' })
  localApresentacao: string;

  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({ name: 'statusevento', nullable: false })
  statusOperacao: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // RELACIONAMENTOS

  @ManyToOne(() => PjesEventoEntity, (pjesevento) => pjesevento.pjesoperacoes)
  @JoinColumn({ name: 'pjeseventoid', referencedColumnName: 'id' })
  pjesevento?: PjesEventoEntity;

  @ManyToOne(() => PjesOperacaoEntity)
  @JoinColumn({ name: 'pjesoperacaoid', referencedColumnName: 'id' })
  pjesoperacao?: PjesOperacaoEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userid', referencedColumnName: 'id' })
  user?: UserEntity;
}
