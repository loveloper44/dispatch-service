import { QueryHandler } from '@nest-kr/cqrs';
import { Injectable, Inject } from '@nestjs/common';

import { GetAllDispatchesQuery } from '@dispatch/application/query/GetAllDispatchesQuery';
import { GetAllDispatchesQueryResult } from '@dispatch/application/query/GetAllDispatchesQueryResult';
import { IDispatchQuery } from '@dispatch/application/query/IDispatchQuery';

@Injectable()
export class DispatchQueryService {
  constructor(@Inject('DispatchQuery') private dispatchQuery: IDispatchQuery) {}

  @QueryHandler(GetAllDispatchesQuery)
  public async handlerGetAllDispatchesQuery(
    query: GetAllDispatchesQuery,
  ): Promise<GetAllDispatchesQueryResult> {
    const { page, count, status } = query;

    const skip = (page - 1) * count;
    const take = count;

    const views = await this.dispatchQuery.findAll(skip, take, status);

    return {
      count: views.length,
      data: views,
    };
  }
}
