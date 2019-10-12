import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}
