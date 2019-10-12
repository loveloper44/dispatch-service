import { IsString, IsNotEmpty } from 'class-validator';

export class RequestDispatchDto {
  @IsString()
  @IsNotEmpty()
  public readonly address: string;
}
