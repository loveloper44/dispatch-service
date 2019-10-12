import * as crypto from 'crypto';

export function getHash(plain: string, salt?: string) {
  const sha = crypto.createHash('sha256');
  if (salt) {
    sha.update(plain + salt);
  } else {
    sha.update(plain);
  }
  return sha.digest('hex');
}
