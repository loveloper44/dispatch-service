import { QueryResult } from '@nest-kr/cqrs';
import * as DispatchView from '@dispatch/application/query/view/DispatchView';

export class GetAllDispatchesQueryResult implements QueryResult {
  constructor(
    public readonly count: number,
    public readonly data: DispatchView.Dispatch[],
  ) {}
}
