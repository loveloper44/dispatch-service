import { Injectable } from '@nestjs/common';

import { UserType, UserProvider } from '@user/constant';

import { UserAssembler } from '@user/application/assembler/UserAssembler';
import * as UserDto from '@user/application/assembler/dto/UserDto';

import { User } from '@user/domain/model/User';

import { UserEntity } from '@user/infra/persistence/entity/UserEntity';
import { PasswordEntity } from '@user/infra/persistence/entity/PasswordEntity';

@Injectable()
export class UserMapper {
  constructor(private userAssembler: UserAssembler) {}

  toDomain(entity: UserEntity): User {
    const { id, email, password, type, provider, version, createdAt } = entity;

    let passwordDto: UserDto.Password | null = null;
    if (password.hashedPassword && password.createdAt) {
      passwordDto = {
        hashedPassword: password.hashedPassword,
        createdAt: password.createdAt,
      };
    }

    let userDto: UserDto.User = {
      id,
      email,
      password: passwordDto,
      type: UserType[type],
      provider: UserProvider[provider],
      version,
      createdAt,
    };

    return this.userAssembler.toDomain(userDto);
  }

  toEntity(domain: User): UserEntity {
    const dto: UserDto.User = this.userAssembler.toDto(domain);
    const { id, email, password, type, provider, version, createdAt } = dto;

    let passwordEntity: PasswordEntity | null = null;

    if (password) {
      passwordEntity = new PasswordEntity();
      passwordEntity.hashedPassword = password.hashedPassword;
      passwordEntity.createdAt = password.createdAt;
    }

    const userEntity = new UserEntity();

    userEntity.id = id;
    userEntity.email = email;
    userEntity.password = passwordEntity;
    userEntity.type = type;
    userEntity.provider = provider;
    userEntity.createdAt = createdAt;
    userEntity.version = version;

    return userEntity;
  }
}
