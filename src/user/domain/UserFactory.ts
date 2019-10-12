import { UserType, UserProvider } from '@user/constant';

import { User } from '@user/domain/model/User';
import { Password } from '@user/domain/model/Password';

export class UserFactory {
  create(
    id: string,
    email: string,
    password: Password | null,
    type: UserType,
    provider: UserProvider,
  ): User {
    return new User(id, email, password, type, provider, new Date(), 0);
  }

  public reconstruct(
    id: string,
    email: string,
    password: Password | null,
    type: UserType,
    provider: UserProvider,
    version: number,
    createdAt: Date,
  ): User {
    return new User(id, email, password, type, provider, createdAt, version);
  }
}
