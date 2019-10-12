import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export function getHash(plain: string, salt?: string) {
  const sha = crypto.createHash('sha256');
  if (salt) {
    sha.update(plain + salt);
  } else {
    sha.update(plain);
  }
  return sha.digest('hex');
}

export function createToken(payload: any, key: string, expiresIn: any) {
  return jwt.sign(payload, key, { expiresIn });
}

export function verifyToken(token: string, key: string) {
  return jwt.verify(token, key);
}
