import {
  VerifyCallback,
  JwtPayload,
  Secret,
  verify as jwtVerify,
  VerifyOptions,
} from 'jsonwebtoken';
// eslint-disable-next-line no-duplicate-imports
import type { Jwt } from 'jsonwebtoken';

export const verifyToken = (
  token: string,
  key: Secret,
  callback: VerifyCallback<string | Jwt | JwtPayload>,
) => {
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
    complete: false,
  };
  return jwtVerify(token, key, verifyOptions, callback);
};
