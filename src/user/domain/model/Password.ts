import { ValueObject } from '@common/domain/ValueObject';

export class Password extends ValueObject<Password> {
  constructor(
    public readonly hashedPassword: string,
    public readonly createdAt: Date,
  ) {
    super();
  }

  public isSamePassword(hashedPassword: string): boolean {
    return this.hashedPassword === hashedPassword;
  }
}
