import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler } from '@nest-kr/cqrs';

import { UserFactory } from '@user/domain/UserFactory';
import { SignUpLocalCommand } from '@user/application/command/SignUpLocalCommand';
import { UserRepository } from '@user/infra/persistence/repository/UserRepository';
import { User } from '@user/domain/model/User';
import { UserProvider } from '@user/constant';
import { Password } from '@user/domain/model/Password';
import { getHash } from '@user/application/Util';

@Injectable()
export class UserCommandService {
  constructor(
    private userFactory: UserFactory,
    private userRepository: UserRepository,
  ) {}

  @CommandHandler(SignUpLocalCommand)
  public async handleSignedUpLocalCommand(
    signUpLocalCommand: SignUpLocalCommand,
  ) {
    const { email, password, type } = signUpLocalCommand;

    if (await this.isDuplicate(email)) {
      throw new UnprocessableEntityException('User already signed up');
    }

    const id = this.userRepository.nextId();

    const hashedPassword = getHash(password);

    const user: User = this.userFactory.create(
      id,
      email,
      new Password(hashedPassword, new Date()),
      type,
      UserProvider.LOCAL,
    );

    await this.userRepository.save(user);
  }

  private async isDuplicate(email: string): Promise<boolean> {
    const user: User | null = await this.userRepository.findByEmail(email);
    return user !== null;
  }
}
