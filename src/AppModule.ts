import { Module, OnModuleInit } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { UserModule } from '@user/UserModule';
import { DispatchModule } from '@dispatch/DispatchModule';

import { CommonModule } from '@root/CommonModule';
import { TerminusOptionsService } from '@root/TerminusOptionsService';

@Module({
  imports: [
    CommonModule,
    UserModule,
    DispatchModule,
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
      imports: [CommonModule],
    }),
  ],
})
export class AppModule {}
