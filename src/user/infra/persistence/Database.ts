import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { PasswordEntity } from '@user/infra/persistence/entity/PasswordEntity';
import { UserEntity } from '@user/infra/persistence/entity/UserEntity';

export class Database {
  private connection: Connection | null;

  constructor() {
    this.connection = null;
  }

  public async connect(option?: ConnectionOptions) {
    if (option) {
      this.connection = await createConnection(option);
    } else {
      this.connection = await createConnection({
        type: 'sqlite',
        database: `:memory:`,
        entities: [UserEntity, PasswordEntity],
        synchronize: true,
      });
    }
  }

  public async disconnect() {
    if (this.connection === null) {
      return;
    }

    await this.connection.close();
    this.connection = null;
  }
}
