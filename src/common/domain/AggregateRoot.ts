import { Entity } from '@common/domain/Entity';

export abstract class AggregateRoot<
  T extends AggregateRoot<T, K>,
  K
> extends Entity<T, K> {
  private version: number;

  constructor(id: K, version: number) {
    super(id);
    this.version = version;
  }

  getVersion(): number {
    return this.version;
  }

  isSameVersion(other: T) {
    return this.version === other.getVersion();
  }
}
