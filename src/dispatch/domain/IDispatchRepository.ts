import { Dispatch } from '@dispatch/domain/model/Dispatch';
import { DispatchStatus } from '@dispatch/constant';

export interface IDispatchRepository {
  nextId(): string;

  save(domain: Dispatch): Promise<void>;

  findAllByPassengerId(
    passengerId: string,
    skip: number,
    take: number,
    status?: DispatchStatus,
  ): Promise<Dispatch[]>;

  findById(id: string): Promise<Dispatch | null>;

  delete(domain: Dispatch): Promise<void>;
}
