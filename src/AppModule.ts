import { Module, OnModuleInit } from '@nestjs/common';

import { UserModule } from '@user/UserModule';
import { DispatchModule } from '@dispatch/DispatchModule';

import { Database } from '@root/Database';

@Module({
  imports: [UserModule, DispatchModule],
  controllers: [],
  providers: [Database],
})
export class AppModule implements OnModuleInit {
  constructor(private database: Database) {}

  async onModuleInit() {
    await this.database.connect();
  }
}
