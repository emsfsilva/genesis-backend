import { AddressEntity } from '../../address/entities/address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/user-type.enum';
import { MasterEntity } from 'src/master/entities/master.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'pg', nullable: false })
  pg: string;

  @Column({ name: 'mat', nullable: false })
  mat: number;

  @Column({ name: 'ng', nullable: false })
  nomeGuerra: string;

  @Column({ name: 'ome', nullable: false })
  ome: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'funcao', nullable: false })
  funcao: string;

  @Column({
    name: 'type_user',
    nullable: false,
    type: 'enum',
    enum: UserType,
  })
  typeUser: UserType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // REALACIONAMENTOS COM OUTRAS TABELAS

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToOne(() => MasterEntity, (master) => master.user)
  master?: MasterEntity;
}
