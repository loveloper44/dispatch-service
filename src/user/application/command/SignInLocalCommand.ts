import { Command } from '@nest-kr/cqrs';

export class SignInLocalCommand implements Command {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
