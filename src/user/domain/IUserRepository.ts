import { User } from '@user/domain/model/User';

export interface IUserRepository {
  nextId(): string;
  save(user: User): Promise<void>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  delete(user: User): Promise<void>;
}
