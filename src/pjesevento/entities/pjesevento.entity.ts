import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import { StatusEventoEnum } from 'src/utils/status-evento.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesevento' })
export class PjesEventoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'nomeevento', nullable: false })
  nomeEvento: string;

  @Column({ name: 'pjesdistid', nullable: false })
  pjesDistId: number;

  @Column({ name: 'codverba', nullable: false })
  codVerba: number;

  @Column({ name: 'omeid', nullable: false })
  omeId: number;

  @Column({ name: 'ttctofevento', nullable: false })
  ttCtOfEvento: number;

  @Column({ name: 'ttctprcevento', nullable: false })
  ttCtPrcEvento: number;

  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({
    name: 'statusevento',
    type: 'enum',
    enum: StatusEventoEnum,
    default: StatusEventoEnum.PENDENTE,
  })
  statusEvento: StatusEventoEnum;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PjesDistEntity, (pjesdist) => pjesdist.pjeseventos)
  @JoinColumn({ name: 'pjesdistid', referencedColumnName: 'id' })
  pjesdist?: PjesDistEntity;

  @OneToMany(
    () => PjesOperacaoEntity,
    (pjesoperacao) => pjesoperacao.pjesevento,
  )
  pjesoperacoes?: PjesOperacaoEntity[];
}
