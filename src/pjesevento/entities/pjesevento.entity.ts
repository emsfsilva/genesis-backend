import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'pjesevento' })
export class PjesEventoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'nomedoevento', nullable: false })
  nomedoevento: string;

  @Column({ name: 'omeid', nullable: false })
  OmeId: number;

  @Column({ name: 'ttctof', nullable: false })
  ttctof: number;

  @Column({ name: 'ttctprc', nullable: false })
  ttctprc: number;

  @Column({ name: 'userid', nullable: false })
  UserId: number;

  @Column({ name: 'statusevento', nullable: false })
  statusevento: string;

  @Column({ name: 'mes', nullable: false })
  mes: number;

  @Column({ name: 'ano', nullable: false })
  ano: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
