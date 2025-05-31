import { CiaEntity } from 'src/cia/entities/cia.entity';
import { UserEntity } from 'src/user/entities/user.entity';
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

@Entity({ name: 'cmtcia' })
export class CmtciaEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'cia_id', nullable: false })
  ciaId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.cmtcia) // Relacionamento ManyToOne com UserEntity
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Chave estrangeira user_id
  user?: UserEntity;

  @ManyToOne(() => CiaEntity, (cia) => cia.cmtcias)
  @JoinColumn({ name: 'cia_id', referencedColumnName: 'id' })
  cia?: CiaEntity;
}
