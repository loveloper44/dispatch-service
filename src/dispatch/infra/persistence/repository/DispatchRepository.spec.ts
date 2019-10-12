import { Test } from '@nestjs/testing';
import * as uuid from 'uuid';
import { clear, advanceTo } from 'jest-date-mock';

import { DispatchStatus } from '@dispatch/constant';

import { DispatchAssembler } from '@dispatch/application/assembler/DispatchAssembler';

import { DispatchFactory } from '@dispatch/domain/DispatchFactory';
import { Dispatch } from '@dispatch/domain/model/Dispatch';

import { DispatchMapper } from '@dispatch/infra/persistence/mapper/DispatchMapper';
import { DispatchRepository } from '@dispatch/infra/persistence/repository/DispatchRepository';

import { Address } from '@root/dispatch/domain/model/Address';
import { Passenger } from '@root/dispatch/domain/model/Passenger';
import { Driver } from '@root/dispatch/domain/model/Driver';
import { Database } from '@root/Database';

describe('DispatchRepository', () => {
  let dispatchRepository: DispatchRepository;
  let dispatchFactory: DispatchFactory;
  let db: Database;

  beforeAll(async () => {
    advanceTo(new Date('2019-10-12T00:00:00.000Z'));

    const module = await Test.createTestingModule({
      providers: [
        DispatchRepository,
        DispatchAssembler,
        DispatchFactory,
        DispatchMapper,
        Database,
      ],
    }).compile();

    dispatchRepository = module.get(DispatchRepository);
    dispatchFactory = module.get(DispatchFactory);

    db = module.get(Database);

    await db.connect();
  });

  afterAll(() => {
    clear();
  });

  describe('.findById()', () => {
    let before: Dispatch;
    let after: Dispatch;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        0,
      );

      after = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        1,
      );
    });

    it('should return null when entity not found', async () => {
      const result = await dispatchRepository.findById(id);
      expect(result).toBeNull();
    });

    it('should return domain when entity found', async () => {
      await dispatchRepository.save(before);
      const result = await dispatchRepository.findById(id);
      expect(result).toEqual(after);
      await dispatchRepository.delete(after);
    });
  });

  describe('.save()', () => {
    let before: Dispatch;
    let after: Dispatch;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        0,
      );

      after = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        1,
      );
    });

    it('should save entity', async () => {
      await dispatchRepository.save(before);
      const result = await dispatchRepository.findById(id);
      expect(result).toEqual(after);
      await dispatchRepository.delete(after);
    });
  });

  describe('.delete()', () => {
    let before: Dispatch;
    let after: Dispatch;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        0,
      );

      after = dispatchFactory.reconstruct(
        id,
        new Address('address'),
        new Passenger('passenger id', 'passenger email'),
        new Driver('driver id', 'driver email'),
        DispatchStatus.MATCHED,
        null,
        null,
        new Date(),
        new Date(),
        1,
      );
    });

    it('should delete entity', async () => {
      await dispatchRepository.save(before);
      const saved = await dispatchRepository.findById(id);

      expect(saved).toEqual(after);

      await dispatchRepository.delete(after);
      const deleted = await dispatchRepository.findById(id);

      expect(deleted).toBeNull();
    });
  });
});
