import { getManager } from 'typeorm';

import { DispatchStatus } from '@dispatch/constant';

import { IDispatchQuery } from '@dispatch/application/query/IDispatchQuery';
import * as DispatchView from '@dispatch/application/query/view/DispatchView';

import { DispatchEntity } from '@dispatch/infra/persistence/entity/DispatchEntity';

export class DispatchQuery implements IDispatchQuery {
  public async findAll(
    skip: number,
    take: number,
    status?: DispatchStatus,
  ): Promise<DispatchView.Dispatch[]> {
    const query = getManager()
      .getRepository(DispatchEntity)
      .createQueryBuilder('d');
    if (status) {
      query.where('d.status = :status', { status });
    }
    query
      .orderBy('d.createdAt', 'DESC')
      .skip(skip)
      .take(take);
    const entities: DispatchEntity[] = await query.getMany();
    return entities.map(entity => {
      const {
        id,
        address,
        passenger,
        driver,
        status,
        requestedAt,
        canceledAt,
        matchedAt,
        createdAt,
        version,
      } = entity;

      return {
        id,
        address,
        passenger,
        driver,
        status: DispatchStatus[status],
        requestedAt,
        canceledAt,
        matchedAt,
        createdAt,
        version,
      };
    });
  }
}
