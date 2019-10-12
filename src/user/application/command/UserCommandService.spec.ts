import { UnprocessableEntityException } from '@nestjs/common';
import * as uuid from 'uuid';
import { Test } from '@nestjs/testing';

import { UserCommandService } from '@user/application/command/UserCommandService';
import { UserFactory } from '@user/domain/UserFactory';
import { UserRepository } from '@user/infra/persistence/repository/UserRepository';
import { User } from '@user/domain/model/User';
import { Password } from '@user/domain/model/Password';
import { getHash } from '@user/application/Util';
import { UserType, UserProvider } from '@user/constant';
import { SignUpLocalCommand } from '@user/application/command/SignUpLocalCommand';

describe('UserCommandService', () => {
  let userCommandService: UserCommandService;

  describe('.handleSignedUpLocalCommand()', () => {
    let userSignedUp: User;
    let userRepository: UserRepository;
    beforeAll(async () => {
      userSignedUp = new User(
        uuid.v1(),
        'abc@remember.co.kr',
        new Password(getHash('abc'), new Date()),
        UserType.PASSENGER,
        UserProvider.LOCAL,
        new Date(),
        1,
      );
      const module = await Test.createTestingModule({
        providers: [
          UserFactory,
          UserCommandService,
          {
            provide: UserRepository,
            useValue: {
              nextId: jest.fn().mockReturnValue(uuid.v1()),
              save: jest.fn(),
              findByEmail: jest.fn().mockImplementation(async email => {
                if (email === 'abc@remember.co.kr') {
                  return userSignedUp;
                } else {
                  return null;
                }
              }),
            },
          },
        ],
      }).compile();

      userCommandService = module.get(UserCommandService);
      userRepository = module.get(UserRepository);
    });

    it('should throw exception when user already signed up', async () => {
      expect.assertions(1);

      const command: SignUpLocalCommand = new SignUpLocalCommand(
        'abc@remember.co.kr',
        'abc',
        UserType.DRIVER,
      );
      try {
        await userCommandService.handleSignedUpLocalCommand(command);
      } catch (e) {
        expect(e.message).toEqual(
          new UnprocessableEntityException('User already signed up').message,
        );
      }
    });

    it('should save new user when email is not exist', async () => {
      const command: SignUpLocalCommand = new SignUpLocalCommand(
        'bbb@remember.co.kr',
        'abc',
        UserType.DRIVER,
      );
      await userCommandService.handleSignedUpLocalCommand(command);

      expect(userRepository.save).toBeCalled();
    });
  });
});
