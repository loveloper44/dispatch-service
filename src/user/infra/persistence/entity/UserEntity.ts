import { Entity, Column, PrimaryColumn } from 'typeorm';

import { PasswordEntity } from '@user/infra/persistence/entity/PasswordEntity';

@Entity()
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column(type => PasswordEntity)
  password: PasswordEntity | null;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'varchar', length: 20 })
  provider: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'integer' })
  version: number;
}
