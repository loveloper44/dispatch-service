import { Column } from 'typeorm';

export class DriverEntity {
  @Column({ type: 'varchar', length: 120, nullable: true })
  id: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  email: string | null;
}
