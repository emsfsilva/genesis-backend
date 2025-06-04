import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesoperacao' })
export class PjesOperacaoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'nomeoperacao', nullable: false })
  nomeOperacao: string;

  @Column({ name: 'pjeseventoid', nullable: false })
  pjesEventoId: number;

  @Column({ name: 'omeid', nullable: false })
  omeId: number;

  @Column({ name: 'ttctofdist', nullable: false })
  ttCtOfDist: number;

  @Column({ name: 'ttctprcdist', nullable: false })
  ttCtPrcDist: number;

  @Column({ name: 'ttctofexe', nullable: false })
  ttCtOfExe: number;

  @Column({ name: 'ttctprcexe', nullable: false })
  ttCtPrcExe: number;

  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({ name: 'statusevento', nullable: false })
  statusOperacao: string;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PjesEventoEntity, (pjesevento) => pjesevento.pjesoperacoes)
  @JoinColumn({ name: 'pjeseventoid', referencedColumnName: 'id' })
  pjesevento?: PjesEventoEntity;
}
