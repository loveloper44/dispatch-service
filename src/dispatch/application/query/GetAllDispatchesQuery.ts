import { Query } from '@nest-kr/cqrs';
import { DispatchStatus } from '@root/dispatch/constant';

export class GetAllDispatchesQuery implements Query {
  constructor(
    public readonly page: number,
    public readonly count: number,
    public readonly status?: DispatchStatus,
  ) {}
}
