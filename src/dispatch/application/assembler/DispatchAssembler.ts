import { classToPlain } from 'class-transformer';
import { Injectable } from '@nestjs/common';

import * as DispatchDto from '@dispatch/application/assembler/dto/DispatchDto';

import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { DispatchFactory } from '@dispatch/domain/DispatchFactory';
import { Address } from '@dispatch/domain/model/Address';
import { Passenger } from '@dispatch/domain/model/Passenger';
import { Driver } from '@dispatch/domain/model/Driver';

@Injectable()
export class DispatchAssembler {
  constructor(private dispatchFactory: DispatchFactory) {}

  toDomain(dto: DispatchDto.Dispatch): Dispatch {
    const {
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
    } = dto;

    return this.dispatchFactory.reconstruct(
      id,
      new Address(address.value),
      new Passenger(passenger.id, passenger.email),
      driver ? new Driver(driver.id, driver.email) : null,
      status,
      requestedAt,
      canceledAt,
      matchedAt,
      createdAt,
      version,
    );
  }

  toDto(domain: Dispatch): DispatchDto.Dispatch {
    const plain: any = classToPlain(domain);
    const {
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
    } = plain;

    return {
      id,
      address: {
        value: address.value,
      },
      passenger: {
        id: passenger.id,
        email: passenger.email,
      },
      driver: driver
        ? {
            id: driver.id,
            email: driver.email,
          }
        : null,
      status,
      requestedAt,
      canceledAt,
      matchedAt,
      createdAt,
      version,
    };
  }
}
