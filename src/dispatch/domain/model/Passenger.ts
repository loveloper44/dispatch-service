import { ValueObject } from '@common/domain/ValueObject';

export class Passenger extends ValueObject<Passenger> {
  constructor(private id: string, private email: string) {
    super();
  }
}
