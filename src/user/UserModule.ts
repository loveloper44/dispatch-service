import { Module } from '@nestjs/common';
import { CqrsModule } from '@nest-kr/cqrs';

import { AuthController } from '@user/interface/AuthController';

import { UserAssembler } from '@user/application/assembler/UserAssembler';
import { UserCommandService } from '@user/application/command/UserCommandService';

import { UserFactory } from '@user/domain/UserFactory';

import { UserMapper } from '@user/infra/persistence/mapper/UserMapper';
import { UserRepository } from '@user/infra/persistence/repository/UserRepository';

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [
    UserRepository,
    UserFactory,
    UserAssembler,
    UserMapper,
    UserCommandService,
  ],
  exports: [],
})
export class UserModule {}
