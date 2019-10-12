import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

import { UserType } from '@dispatch/constant';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  public readonly id: string;

  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @IsEnum(UserType)
  public readonly type: UserType;
}
