import { IsNumber, ValidateIf, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

import { DispatchStatus } from '@root/dispatch/constant';

export class GetAllDispatchesDto {
  @Transform(value => {
    const result = parseInt(value, 10);
    return result;
  })
  @IsNumber()
  public readonly page: number = 1;

  @Transform(value => {
    const result = parseInt(value, 10);
    return result;
  })
  @IsNumber()
  public readonly count: number = 30;

  @ValidateIf(dto => !!dto.status)
  @Transform(value => {
    return DispatchStatus[value];
  })
  @IsEnum(DispatchStatus)
  public readonly status?: DispatchStatus;
}
