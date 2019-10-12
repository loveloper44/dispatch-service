import { ValueObject } from '@common/domain/ValueObject';

export class Driver extends ValueObject<Driver> {
  constructor(private id: string, private email: string) {
    super();
  }
}
