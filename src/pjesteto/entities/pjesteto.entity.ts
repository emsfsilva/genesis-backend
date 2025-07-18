import { PjesDistEntity } from 'src/pjesdist/entities/pjesdist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesteto' })
export class PjesTetoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'imagem_url', nullable: true })
  imagemUrl: string;

  @Column({ name: 'nomeverba', nullable: false })
  nomeVerba: string;

  @Column({ name: 'codverba', nullable: false })
  codVerba: number;

  @Column({ name: 'tetoof', nullable: false })
  tetoOf: number;

  @Column({ name: 'tetoprc', nullable: false })
  tetoPrc: number;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PjesDistEntity, (pjesdist) => pjesdist.pjesteto)
  pjesdists?: PjesDistEntity[];
}
