import { DispatchStatus } from '@dispatch/constant';
import * as DispatchView from '@dispatch/application/query/view/DispatchView';

export interface IDispatchQuery {
  findAll(
    skip: number,
    take: number,
    status?: DispatchStatus,
  ): Promise<DispatchView.Dispatch[]>;
}
