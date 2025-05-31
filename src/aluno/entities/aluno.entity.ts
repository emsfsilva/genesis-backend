import { UserEntity } from 'src/user/entities/user.entity';
import { TurmaEntity } from '../../turma/entities/turma.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'aluno' })
export class AlunoEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'resp1', type: 'int', nullable: true })
  resp1: number;

  @Column({ name: 'resp2', type: 'int', nullable: true })
  resp2: number;

  @Column({ name: 'turma_id', nullable: true })
  turmaId: number;

  @Column({ name: 'grau_inicial', type: 'float', nullable: false })
  grauInicial: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TurmaEntity, (turma: TurmaEntity) => turma.alunos)
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turma?: TurmaEntity;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.aluno)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'resp1', referencedColumnName: 'id' })
  responsavel1?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'resp2', referencedColumnName: 'id' })
  responsavel2?: UserEntity;
}
