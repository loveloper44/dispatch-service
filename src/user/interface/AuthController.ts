import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nest-kr/cqrs';

import { SignUpDto } from '@user/interface/dto/SignUpDto';
import { SignInDto } from '@user/interface/dto/SignInDto';
import { SignUpLocalCommand } from '@user/application/command/SignUpLocalCommand';
import { SignInLocalCommand } from '@user/application/command/SignInLocalCommand';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/sign-up')
  @UsePipes(new ValidationPipe())
  public async signUp(@Body() dto: SignUpDto) {
    const { email, password, type } = dto;

    const command = new SignUpLocalCommand(email, password, type);

    await this.commandBus.execute(command);

    return {
      message: 'Signed up successfully',
    };
  }

  @Post('/sign-in')
  @UsePipes(new ValidationPipe())
  public async signIn(@Body() dto: SignInDto) {
    const { email, password } = dto;

    const command = new SignInLocalCommand(email, password);

    const result = await this.commandBus.execute(command);

    return {
      message: 'Signed in successfully',
      result,
    };
  }
}
