import { Column } from 'typeorm';

export class PassengerEntity {
  @Column({ type: 'varchar', length: 120 })
  id: string;

  @Column({ type: 'varchar', length: 120 })
  email: string;
}
