import { ValueObject } from '@common/domain/ValueObject';

export class Address extends ValueObject<Address> {
  constructor(public readonly value: string) {
    super();
  }
}
