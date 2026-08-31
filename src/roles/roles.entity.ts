import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instrutor } from '../@common/entities/instrutor.entity';

export enum RolesEnum {
  ADMIN = 'admin',
  PLEBEU = 'plebeu',
  INSTRUTOR = 'instrutor',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id!: number;

  @Column('varchar', { length: 255 })
  role!: RolesEnum;

  @ManyToMany(() => Instrutor, (instrutor) => instrutor.roles)
  @JoinTable()
  instrutores!: Instrutor[];
}
