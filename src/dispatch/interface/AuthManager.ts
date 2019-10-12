import { plainToClass } from 'class-transformer';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { verifyToken } from '@dispatch/Util';
import { ACCESS_TOKEN_KEY } from '@dispatch/config';

import { UserDto } from '@dispatch/interface/dto/UserDto';
import { UserType } from '@dispatch/constant';

@Injectable()
export class AuthManager {
  verify(req: any): UserDto {
    const authorization =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authorization) {
      throw new ForbiddenException();
    }

    const tokens = authorization.split(' ');

    if (tokens.length === 2 && tokens[0] === 'Bearer') {
      const decoded: any = verifyToken(tokens[1], ACCESS_TOKEN_KEY);
      const userDto = plainToClass(UserDto, {
        id: decoded.id,
        email: decoded.email,
        type: UserType[decoded.type],
      });

      return userDto;
    } else {
      throw new ForbiddenException();
    }
  }
}
