import { Module } from '@nestjs/common';
import { CqrsModule } from '@nest-kr/cqrs';

import { DispatchController } from '@dispatch/interface/DispatchController';
import { AuthManager } from '@dispatch/interface/AuthManager';

import { DispatchAssembler } from '@dispatch/application/assembler/DispatchAssembler';
import { DispatchCommandService } from '@dispatch/application/command/DispatchCommandService';

import { DispatchFactory } from '@dispatch/domain/DispatchFactory';

import { DispatchMapper } from '@dispatch/infra/persistence/mapper/DispatchMapper';
import { DispatchRepository } from '@dispatch/infra/persistence/repository/DispatchRepository';

@Module({
  imports: [CqrsModule],
  controllers: [DispatchController],
  providers: [
    DispatchRepository,
    DispatchFactory,
    DispatchAssembler,
    DispatchMapper,
    DispatchCommandService,
    AuthManager,
  ],
  exports: [],
})
export class DispatchModule {}
