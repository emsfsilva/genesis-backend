import { PjesOperacaoEntity } from 'src/pjesoperacao/entities/pjesoperacao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ name: 'omeid', nullable: false })
  omeId: number;

  @Column({ name: 'ttctof', nullable: false })
  ttCtOf: number;

  @Column({ name: 'ttctprc', nullable: false })
  ttCtPrc: number;

  @Column({ name: 'userid', nullable: false })
  userId: number;

  @Column({ name: 'statusevento', nullable: false })
  statusEvento: string;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => PjesOperacaoEntity,
    (pjesoperacao) => pjesoperacao.pjesevento,
  )
  pjesoperacoes?: PjesOperacaoEntity[];
}
