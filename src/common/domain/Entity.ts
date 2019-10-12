export class Entity<T extends Entity<T, K>, K> {
  constructor(private id: K) {}

  getId() {
    return this.id;
  }

  isIdentical(other: T) {
    return this.id === other.getId();
  }
}
