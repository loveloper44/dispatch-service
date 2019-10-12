import { Entity, Column, PrimaryColumn } from 'typeorm';

import { AddressEntity } from '@dispatch/infra/persistence/entity/AddressEntity';
import { PassengerEntity } from '@dispatch/infra/persistence/entity/PassengerEntity';
import { DriverEntity } from '@dispatch/infra/persistence/entity/DriverEntity';

@Entity()
export class DispatchEntity {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  id: string;

  @Column(type => AddressEntity)
  address: AddressEntity;

  @Column(type => PassengerEntity)
  passenger: PassengerEntity;

  @Column(type => DriverEntity)
  driver: DriverEntity | null;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  requestedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  canceledAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  matchedAt: Date | null;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'integer' })
  version: number;
}
