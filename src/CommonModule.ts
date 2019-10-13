import { Module } from '@nestjs/common';

import { Database } from '@root/Database';
import { Application } from '@root/Application';

@Module({
  providers: [Database, Application],
  exports: [Database, Application],
})
export class CommonModule {}
