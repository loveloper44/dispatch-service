import { Test } from '@nestjs/testing';
import * as uuid from 'uuid';
import { clear, advanceTo } from 'jest-date-mock';

import { getHash } from '@user/Util';

import { UserRepository } from '@user/infra/persistence/repository/UserRepository';
import { UserAssembler } from '@user/application/assembler/UserAssembler';
import { UserFactory } from '@user/domain/UserFactory';
import { UserMapper } from '@user/infra/persistence/mapper/UserMapper';
import { User } from '@user/domain/model/User';
import { Password } from '@user/domain/model/Password';
import { UserType, UserProvider } from '@user/constant';
import { Database } from '@root/Database';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userFactory: UserFactory;
  let db: Database;

  beforeAll(async () => {
    advanceTo(new Date('2019-10-12T00:00:00.000Z'));

    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        UserAssembler,
        UserFactory,
        UserMapper,
        Database,
      ],
    }).compile();

    userRepository = module.get(UserRepository);
    userFactory = module.get(UserFactory);

    db = module.get(Database);

    await db.connect();
  });

  afterAll(async () => {
    clear();
    await db.disconnect();
  });

  describe('.findById()', () => {
    let before: User;
    let after: User;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        0,
        new Date(),
      );
      after = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        1,
        new Date(),
      );
    });

    it('should return null when entity not found', async () => {
      const result = await userRepository.findById(id);
      expect(result).toBeNull();
    });

    it('should return domain when entity found', async () => {
      await userRepository.save(before);
      const result = await userRepository.findById(id);
      expect(result).toEqual(after);
      await userRepository.delete(after);
    });
  });

  describe('.save()', () => {
    let before: User;
    let after: User;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        0,
        new Date(),
      );
      after = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        1,
        new Date(),
      );
    });

    it('should save entity', async () => {
      await userRepository.save(before);
      const result = await userRepository.findById(id);
      expect(result).toEqual(after);
      await userRepository.delete(after);
    });
  });

  describe('.delete()', () => {
    let before: User;
    let after: User;
    let id: string;

    beforeEach(() => {
      id = uuid.v1();
      before = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        0,
        new Date(),
      );
      after = userFactory.reconstruct(
        id,
        'abc@remember.co.kr',
        new Password(getHash('test'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        1,
        new Date(),
      );
    });

    it('should delete entity', async () => {
      await userRepository.save(before);
      const saved = await userRepository.findById(id);

      expect(saved).toEqual(after);

      await userRepository.delete(after);
      const deleted = await userRepository.findById(id);

      expect(deleted).toBeNull();
    });
  });
});
