import { DispatchStatus } from '@dispatch/constant';

import { Passenger } from '@dispatch/domain/model/Passenger';
import { Address } from '@dispatch/domain/model/Address';
import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { Driver } from '@dispatch/domain/model/Driver';

export class DispatchFactory {
  public create(id: string, address: Address, passenger: Passenger) {
    return new Dispatch(
      id,
      address,
      passenger,
      null,
      DispatchStatus.IDLE,
      null,
      null,
      null,
      new Date(),
      0,
    );
  }

  public reconstruct(
    id: string,
    address: Address,
    passenger: Passenger,
    driver: Driver | null,
    status: DispatchStatus,
    requestedAt: Date | null,
    canceledAt: Date | null,
    matchedAt: Date | null,
    createdAt: Date,
    version: number,
  ) {
    return new Dispatch(
      id,
      address,
      passenger,
      driver,
      status,
      requestedAt,
      canceledAt,
      matchedAt,
      createdAt,
      version,
    );
  }
}
