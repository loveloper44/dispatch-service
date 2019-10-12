import { Injectable } from '@nestjs/common';

import { DispatchStatus } from '@dispatch/constant';

import { DispatchAssembler } from '@dispatch/application/assembler/DispatchAssembler';
import * as DispatchDto from '@dispatch/application/assembler/dto/DispatchDto';

import { Dispatch } from '@dispatch/domain/model/Dispatch';

import { DriverEntity } from '@dispatch/infra/persistence/entity/DriverEntity';
import { AddressEntity } from '@dispatch/infra/persistence/entity/AddressEntity';
import { PassengerEntity } from '@dispatch/infra/persistence/entity/PassengerEntity';
import { DispatchEntity } from '@dispatch/infra/persistence/entity/DispatchEntity';

@Injectable()
export class DispatchMapper {
  constructor(private dispatchAssembler: DispatchAssembler) {}

  toDomain(entity: DispatchEntity): Dispatch {
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
    } = entity;

    const addressDto: DispatchDto.Address = {
      value: address.value,
    };

    const passengerDto: DispatchDto.Passenger | null = {
      id: passenger.id,
      email: passenger.email,
    };

    let driverDto: DispatchDto.Driver | null = null;
    if (driver.id && driver.email) {
      driverDto = {
        id: driver.id,
        email: driver.email,
      };
    }

    let dispatchDto: DispatchDto.Dispatch = {
      id,
      address: addressDto,
      passenger: passengerDto,
      driver: driverDto,
      status: DispatchStatus[status],
      requestedAt,
      canceledAt,
      matchedAt,
      createdAt,
      version,
    };

    return this.dispatchAssembler.toDomain(dispatchDto);
  }

  toEntity(domain: Dispatch): DispatchEntity {
    const dto: DispatchDto.Dispatch = this.dispatchAssembler.toDto(domain);
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

    let addressEntity: AddressEntity = new AddressEntity();
    addressEntity.value = address.value;

    let passengerEntity: PassengerEntity = new PassengerEntity();
    passengerEntity.id = passenger.id;
    passengerEntity.email = passenger.email;

    let driverEntity: DriverEntity | null = null;
    if (driver) {
      driverEntity = new DriverEntity();
      driverEntity.id = driver.id;
      driverEntity.email = driver.email;
    }

    const dispatchEntity = new DispatchEntity();
    dispatchEntity.id = id;
    dispatchEntity.address = addressEntity;
    dispatchEntity.passenger = passengerEntity;
    dispatchEntity.driver = driverEntity;
    dispatchEntity.status = status;
    dispatchEntity.requestedAt = requestedAt;
    dispatchEntity.canceledAt = canceledAt;
    dispatchEntity.matchedAt = matchedAt;
    dispatchEntity.createdAt = createdAt;
    dispatchEntity.version = version;

    return dispatchEntity;
  }
}
