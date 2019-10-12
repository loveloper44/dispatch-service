import { Column } from 'typeorm';

export class AddressEntity {
  @Column({ type: 'varchar' })
  value: string;
}
