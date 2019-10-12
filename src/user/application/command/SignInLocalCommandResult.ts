import { CommandResult } from '@nest-kr/cqrs';

export class SignInLocalCommandResult implements CommandResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
