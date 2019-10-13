import { AggregateRoot } from '@common/domain/AggregateRoot';

import { DispatchStatus } from '@dispatch/constant';

import { Driver } from '@dispatch/domain/model/Driver';
import { Passenger } from '@dispatch/domain/model/Passenger';
import { Address } from '@dispatch/domain/model/Address';
import {
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';

export class Dispatch extends AggregateRoot<Dispatch, string> {
  constructor(
    id: string,
    private address: Address,
    private passenger: Passenger,
    private driver: Driver | null,
    private status: DispatchStatus,
    private requestedAt: Date | null,
    private canceledAt: Date | null,
    private matchedAt: Date | null,
    private createdAt: Date,
    version: number,
  ) {
    super(id, version);
  }

  matchBy(driver: Driver) {
    if (this.status !== DispatchStatus.WAITING) {
      throw new UnprocessableEntityException('Status is not waiting');
    }

    this.driver = driver;

    this.status = DispatchStatus.MATCHED;

    this.matchedAt = new Date();
  }

  cancelBy(passenger: Passenger) {
    if (!this.passenger.equals(passenger)) {
      throw new ForbiddenException();
    }

    if (this.status !== DispatchStatus.WAITING) {
      throw new UnprocessableEntityException('Status is not waiting');
    }

    this.status = DispatchStatus.CANCELED;

    this.canceledAt = new Date();
  }

  requestBy(passenger: Passenger) {
    if (!this.passenger.equals(passenger)) {
      throw new ForbiddenException();
    }

    if (this.status !== DispatchStatus.IDLE) {
      throw new UnprocessableEntityException('Status is not idle');
    }

    this.status = DispatchStatus.WAITING;

    this.requestedAt = new Date();
  }
}
