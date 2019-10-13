import { IsString, IsNotEmpty, IsEnum, IsEmail } from 'class-validator';

import { UserType } from '@user/constant';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @IsEnum(UserType)
  public readonly type: UserType;
}
