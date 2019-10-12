import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Req,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nest-kr/cqrs';

import { UserType } from '@dispatch/constant';

import { RequestDispatchDto } from '@dispatch/interface/dto/RequestDispatchDto';
import { AuthManager } from '@dispatch/interface/AuthManager';
import { UserDto } from '@dispatch/interface/dto/UserDto';

import { RequestDispatchCommand } from '@dispatch/application/command/RequestDispatchCommand';
import { RequestDispatchCommandResult } from '@dispatch/application/command/RequestDispatchCommandResult';
import { MatchDispatchCommand } from '@dispatch/application/command/MatchDispatchCommand';

@Controller('dispatches')
export class DispatchController {
  constructor(
    private commandBus: CommandBus,
    private authManager: AuthManager,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public async requestDispatch(
    @Req() req: Request,
    @Body() dto: RequestDispatchDto,
  ) {
    const userDto: UserDto = this.authManager.verify(req);
    const { address } = dto;

    if (userDto.type !== UserType.PASSENGER) {
      throw new BadRequestException('Type is not passenger');
    }

    const command: RequestDispatchCommand = new RequestDispatchCommand(
      address,
      {
        id: userDto.id,
        email: userDto.email,
      },
    );

    const result: RequestDispatchCommandResult = await this.commandBus.execute(
      command,
    );

    return {
      message: 'Requested successfully',
      result,
    };
  }

  @Post('/:dispatchId/match')
  @UsePipes(new ValidationPipe())
  public async matchDispatch(
    @Req() req: Request,
    @Param('dispatchId') dispatchId: string,
  ) {
    const userDto: UserDto = this.authManager.verify(req);

    if (userDto.type !== UserType.DRIVER) {
      throw new BadRequestException('Type is not driver');
    }

    const command: MatchDispatchCommand = new MatchDispatchCommand(dispatchId, {
      id: userDto.id,
      email: userDto.email,
    });

    await this.commandBus.execute(command);

    return {
      message: 'Matched successfully',
      result: null,
    };
  }
}
