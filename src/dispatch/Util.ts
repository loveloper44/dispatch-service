import * as jwt from 'jsonwebtoken';

export function verifyToken(token: string, key: string) {
  return jwt.verify(token, key);
}
