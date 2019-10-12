import { Column } from 'typeorm';

export class PasswordEntity {
  @Column({ type: 'varchar' })
  hashedPassword: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
