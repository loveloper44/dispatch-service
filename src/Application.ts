import {
  OnApplicationBootstrap,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';

import { Database } from '@root/Database';

@Injectable()
export class Application
  implements OnApplicationShutdown, OnApplicationBootstrap {
  constructor(private db: Database) {}

  public async checkHealth() {
    let healthInfo: any = {};
    try {
      this.db.checkHealth();
      healthInfo.db = 'working';
    } catch (e) {
      healthInfo.db = 'not working';
    }

    return healthInfo;
  }

  public async onApplicationShutdown(signal?: string) {
    await this.db.disconnect();
  }
  public async onApplicationBootstrap() {
    await this.db.connect();
  }
}
