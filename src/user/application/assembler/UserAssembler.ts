import { Injectable } from '@nestjs/common';
import { classToPlain } from 'class-transformer';

import { User } from '@user/domain/model/User';
import * as UserDto from '@user/application/assembler/dto/UserDto';
import { UserFactory } from '@user/domain/UserFactory';
import { Password } from '@user/domain/model/Password';

@Injectable()
export class UserAssembler {
  constructor(private userFactory: UserFactory) {}

  public toDto(domain: User): UserDto.User {
    const plain: any = classToPlain(domain);

    const { id, email, password, type, provider, version, createdAt } = plain;

    return {
      id,
      email,
      password: password
        ? {
            hashedPassword: password.hashedPassword,
            createdAt: password.createdAt,
          }
        : null,
      type,
      provider,
      version,
      createdAt,
    };
  }

  public toDomain(dto: UserDto.User): User {
    const { id, email, password, type, provider, version, createdAt } = dto;

    return this.userFactory.reconstruct(
      id,
      email,
      new Password(password.hashedPassword, password.createdAt),
      type,
      provider,
      version,
      createdAt,
    );
  }
}
