import { UnprocessableEntityException } from '@nestjs/common';

import { AggregateRoot } from '@common/domain/AggregateRoot';

import { UserType, UserProvider } from '@user/constant';
import { Password } from '@user/domain/model/Password';

export class User extends AggregateRoot<User, string> {
  constructor(
    id: string,
    private email: string,
    private password: Password | null,
    private type: UserType,
    private provider: UserProvider,
    private createdAt: Date,
    version: number,
  ) {
    super(id, version);
  }

  public authenticate(otherPassword: Password | null): boolean {
    if (this.provider === UserProvider.LOCAL) {
      return this.password.equals(otherPassword);
    } else {
      throw new UnprocessableEntityException('Provider is invalid');
    }
  }
}
