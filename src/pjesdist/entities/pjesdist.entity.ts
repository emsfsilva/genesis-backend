import { PjesEventoEntity } from 'src/pjesevento/entities/pjesevento.entity';
import { StatusDistEnum } from 'src/utils/status-dist.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesdist' })
export class PjesDistEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'nomedist', nullable: false })
  nomeDist: string;

  @Column({ name: 'diretoriaid', nullable: false })
  diretoriaId: number;

  @Column({ name: 'ttctofdist', nullable: false })
  ttCtOfDist: number;

  @Column({ name: 'ttctprcdist', nullable: false })
  ttCtPrcDist: number;

  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({
    name: 'statusdist',
    type: 'enum',
    enum: StatusDistEnum,
    default: StatusDistEnum.PENDENTE,
  })
  statusDist: StatusDistEnum;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PjesEventoEntity, (pjesevento) => pjesevento.pjesdist)
  pjeseventos?: PjesEventoEntity[];
}
