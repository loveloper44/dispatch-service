import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

import { UserType } from '@user/constant';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @IsEnum(UserType)
  public readonly type: UserType;
}
