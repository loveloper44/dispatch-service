import { UserType } from '@user/constant';
import { Command } from '@nest-kr/cqrs';

export class SignUpLocalCommand implements Command {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly type: UserType,
  ) {}
}
