import { AdmEntity } from 'src/adm/entities/adm.entity';
import { CmtciaEntity } from 'src/cmtcia/entities/cmtcia.entity';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { TurmaEntity } from 'src/turma/entities/turma.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cia' })
export class CiaEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TurmaEntity, (turma) => turma.cia)
  turmas?: TurmaEntity[];

  @OneToMany(() => AdmEntity, (adm) => adm.cia)
  adms?: AdmEntity[];

  @OneToMany(() => MonitorEntity, (monitor) => monitor.cia)
  monitores?: MonitorEntity[];

  @OneToMany(() => CmtciaEntity, (cmtcia) => cmtcia.cia)
  cmtcias?: CmtciaEntity[];
}
