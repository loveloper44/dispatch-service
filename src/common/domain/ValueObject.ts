export class ValueObject<T extends ValueObject<T>> {
  equals(other: T): boolean {
    return this.getHashCode() === other.getHashCode();
  }

  getHashCode() {
    return JSON.stringify(this);
  }
}
