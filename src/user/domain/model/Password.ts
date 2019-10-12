import { ValueObject } from '@common/domain/ValueObject';

export class Password extends ValueObject<Password> {
  constructor(
    public readonly hashedPassword: string,
    public readonly createdAt: Date,
  ) {
    super();
  }

  public equals(otherPassword: Password): boolean {
    return this.hashedPassword === otherPassword.hashedPassword;
  }
}
