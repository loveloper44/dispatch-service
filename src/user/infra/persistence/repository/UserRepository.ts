import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { getManager } from 'typeorm';
import * as uuid from 'uuid';

import { UserMapper } from '@user/infra/persistence/mapper/UserMapper';
import { User } from '@user/domain/model/User';
import { IUserRepository } from '@user/domain/IUserRepository';
import { UserEntity } from '@user/infra/persistence/entity/UserEntity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private userMapper: UserMapper) {}

  public nextId(): string {
    return uuid.v1();
  }

  public async save(domain: User) {
    this.optimisticLock(domain);

    const entity = this.userMapper.toEntity(domain);

    this.updateVersion(entity);

    await getManager()
      .getRepository(UserEntity)
      .save(entity);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const entity: UserEntity | undefined = await getManager()
      .getRepository(UserEntity)
      .findOne({
        where: { email },
      });

    if (entity === undefined) {
      return null;
    }

    return this.userMapper.toDomain(entity);
  }

  public async findById(id: string): Promise<User | null> {
    const entity: UserEntity | undefined = await getManager()
      .getRepository(UserEntity)
      .findOne(id);

    if (entity === undefined) {
      return null;
    }

    return this.userMapper.toDomain(entity);
  }

  public async delete(domain: User) {
    this.optimisticLock(domain);

    const entity = this.userMapper.toEntity(domain);

    await getManager()
      .getRepository(UserEntity)
      .remove(entity);
  }

  private async optimisticLock(domain: User) {
    const curDomain = await this.findById(domain.getId());

    if (curDomain === null) {
      return;
    }

    if (!curDomain.isSameVersion(domain)) {
      throw new UnprocessableEntityException('Entity is already updated');
    }
  }

  private updateVersion(entity: UserEntity) {
    entity.version = entity.version + 1;
  }
}
