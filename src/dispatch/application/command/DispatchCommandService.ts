import {
  Injectable,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler } from '@nest-kr/cqrs';

import { DispatchStatus } from '@dispatch/constant';

import { MatchDispatchCommand } from '@dispatch/application/command/MatchDispatchCommand';
import { RequestDispatchCommand } from '@dispatch/application/command/RequestDispatchCommand';
import { RequestDispatchCommandResult } from '@dispatch/application/command/RequestDispatchCommandResult';

import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { Driver } from '@dispatch/domain/model/Driver';
import { IDispatchRepository } from '@dispatch/domain/IDispatchRepository';
import { DispatchFactory } from '@dispatch/domain/DispatchFactory';
import { Address } from '@dispatch/domain/model/Address';
import { Passenger } from '@dispatch/domain/model/Passenger';

@Injectable()
export class DispatchCommandService {
  constructor(
    @Inject('DispatchRepository')
    private dispatchRepository: IDispatchRepository,
    private dispatchFactory: DispatchFactory,
  ) {}

  @CommandHandler(MatchDispatchCommand)
  public async handleMatchDispatchCommand(command: MatchDispatchCommand) {
    const {
      dispatchId,
      driver: { id: driverId, email: driverEmail },
    } = command;

    const dispatch: Dispatch | null = await this.dispatchRepository.findById(
      dispatchId,
    );

    if (dispatch === null) {
      throw new NotFoundException('Dispatch not found');
    }

    dispatch.matchBy(new Driver(driverId, driverEmail));

    await this.dispatchRepository.save(dispatch);
  }

  @CommandHandler(RequestDispatchCommand)
  public async handleRequestDispatchCommand(
    command: RequestDispatchCommand,
  ): Promise<RequestDispatchCommandResult> {
    const {
      address,
      passenger: { id: passengerId, email: passengerEmail },
    } = command;

    const dispatches: Dispatch[] = await this.dispatchRepository.findAllByPassengerId(
      passengerId,
      0,
      1,
      DispatchStatus.WAITING,
    );

    if (dispatches.length > 0) {
      throw new UnprocessableEntityException('Already requested');
    }

    const passenger = new Passenger(passengerId, passengerEmail);

    const dispatchId = this.dispatchRepository.nextId();
    const dispatch: Dispatch = this.dispatchFactory.create(
      dispatchId,
      new Address(address),
      passenger,
    );

    dispatch.requestBy(passenger);

    await this.dispatchRepository.save(dispatch);

    return {
      dispatchId,
    };
  }
}
