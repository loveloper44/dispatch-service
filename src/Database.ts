import {
  createConnection,
  Connection,
  ConnectionOptions,
  getConnection,
} from 'typeorm';
import { PasswordEntity } from '@user/infra/persistence/entity/PasswordEntity';
import { UserEntity } from '@user/infra/persistence/entity/UserEntity';
import { DispatchEntity } from '@dispatch/infra/persistence/entity/DispatchEntity';
import { DriverEntity } from '@dispatch/infra/persistence/entity/DriverEntity';
import { AddressEntity } from '@dispatch/infra/persistence/entity/AddressEntity';

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
        entities: [
          DispatchEntity,
          PasswordEntity,
          DriverEntity,
          AddressEntity,
          UserEntity,
          PasswordEntity,
        ],
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

  public async checkHealth(): Promise<void> {
    const connection = getConnection();
    await connection.query('SELECT 1+1 AS result');
  }
}
