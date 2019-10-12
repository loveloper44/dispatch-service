import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RequestDispatchDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  public readonly address: string;
}
