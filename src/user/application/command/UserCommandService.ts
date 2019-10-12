import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { CommandHandler } from '@nest-kr/cqrs';

import { UserProvider } from '@user/constant';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRE_IN,
} from '@user/config';

import { SignUpLocalCommand } from '@user/application/command/SignUpLocalCommand';
import { SignInLocalCommandResult } from '@user/application/command/SignInLocalCommandResult';
import { SignInLocalCommand } from '@user/application/command/SignInLocalCommand';
import * as UserDto from '@user/application/assembler/dto/UserDto';
import { getHash, createToken } from '@user/application/Util';
import { UserAssembler } from '@user/application/assembler/UserAssembler';

import { UserFactory } from '@user/domain/UserFactory';
import { User } from '@user/domain/model/User';
import { Password } from '@user/domain/model/Password';
import { IUserRepository } from '@user/domain/IUserRepository';

@Injectable()
export class UserCommandService {
  constructor(
    private userFactory: UserFactory,
    private userAssembler: UserAssembler,
    @Inject('UserRepository') private userRepository: IUserRepository,
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

  @CommandHandler(SignInLocalCommand)
  public async handleSignedInLocalCommand(
    signInLocalCommand: SignInLocalCommand,
  ): Promise<SignInLocalCommandResult> {
    const { email, password } = signInLocalCommand;

    const user: User | null = await this.userRepository.findByEmail(email);

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = getHash(password);

    if (!user.authenticate(hashedPassword)) {
      throw new UnauthorizedException();
    }

    const dto: UserDto.User = this.userAssembler.toDto(user);
    const payload: any = {
      id: dto.id,
      email: dto.email,
      type: dto.type,
    };
    const accessToken = createToken(
      payload,
      ACCESS_TOKEN_KEY,
      ACCESS_TOKEN_EXPIRE_IN,
    );
    const refreshToken = createToken(
      payload,
      REFRESH_TOKEN_KEY,
      REFRESH_TOKEN_EXPIRE_IN,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
