import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { getManager } from 'typeorm';
import * as uuid from 'uuid';

import { IDispatchRepository } from '@dispatch/domain/IDispatchRepository';

import { DispatchEntity } from '@dispatch/infra/persistence/entity/DispatchEntity';
import { DispatchMapper } from '@dispatch/infra/persistence/mapper/DispatchMapper';
import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { DispatchStatus } from '@dispatch/constant';

@Injectable()
export class DispatchRepository implements IDispatchRepository {
  constructor(private dispatchMapper: DispatchMapper) {}

  public nextId(): string {
    return uuid.v1();
  }

  public async save(domain: Dispatch) {
    this.optimisticLock(domain);

    const entity = this.dispatchMapper.toEntity(domain);

    this.updateVersion(entity);

    await getManager()
      .getRepository(DispatchEntity)
      .save(entity);
  }

  public async findAllByPassengerId(
    passengerId: string,
    skip: number,
    take: number,
    status?: DispatchStatus,
  ): Promise<Dispatch[]> {
    const query = getManager()
      .getRepository(DispatchEntity)
      .createQueryBuilder('d');

    query.where('d.passengerId = :passengerId', { passengerId });

    if (status) {
      query.andWhere('d.status = :status', { status });
    }

    const entities: DispatchEntity[] = await query
      .skip(skip)
      .take(take)
      .getMany();

    return entities.map(entity => {
      return this.dispatchMapper.toDomain(entity);
    });
  }

  public async findById(id: string): Promise<Dispatch | null> {
    const entity: DispatchEntity | undefined = await getManager()
      .getRepository(DispatchEntity)
      .findOne(id);

    if (entity === undefined) {
      return null;
    }

    return this.dispatchMapper.toDomain(entity);
  }

  public async delete(domain: Dispatch) {
    this.optimisticLock(domain);

    const entity = this.dispatchMapper.toEntity(domain);

    await getManager()
      .getRepository(DispatchEntity)
      .remove(entity);
  }

  private async optimisticLock(domain: Dispatch) {
    const curDomain = await this.findById(domain.getId());

    if (curDomain === null) {
      return;
    }

    if (!curDomain.isSameVersion(domain)) {
      throw new UnprocessableEntityException('Entity is already updated');
    }
  }

  private updateVersion(entity: DispatchEntity) {
    entity.version = entity.version + 1;
  }
}
