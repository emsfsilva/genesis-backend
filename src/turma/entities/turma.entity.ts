import { CiaEntity } from 'src/cia/entities/cia.entity';
import { AlunoEntity } from '../../aluno/entities/aluno.entity';
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

@Entity({ name: 'turma' })
export class TurmaEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'cia_id', nullable: false })
  ciaId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  //@OneToMany(() => AlunoEntity, (aluno: AlunoEntity) => aluno.turma)
  //aluno?: AlunoEntity;

  @OneToMany(() => AlunoEntity, (aluno: AlunoEntity) => aluno.turma)
  alunos?: AlunoEntity[];

  @ManyToOne(() => CiaEntity, (cia) => cia.turmas)
  @JoinColumn({ name: 'cia_id', referencedColumnName: 'id' })
  cia?: CiaEntity;
}
