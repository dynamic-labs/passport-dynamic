import { IncomingHttpHeaders } from 'http2';
import { Jwt, JwtPayload, Secret } from 'jsonwebtoken';
// eslint-disable-next-line no-duplicate-imports
import { Strategy } from 'passport-strategy';
import { verifyToken } from './verifyToken';

interface StrategyOptions {
  publicKey: string;
}

interface Request {
  headers: IncomingHttpHeaders;
}

export class DynamicStrategy extends Strategy {
  authHeaderRegex = /(\S+)\s+(\S+)/;
  name = 'dynamicStrategy';

  _secretOrKeyProvider: (request: Request, rawJwtToken: any, done: any) => void;
  verify: (payload: Jwt | JwtPayload | string | undefined, done: any) => void;

  constructor(
    options: StrategyOptions,
    verify: (payload: Jwt | JwtPayload | string | undefined, done: any) => void,
  ) {
    super();

    const publicKey = options.publicKey;

    if (!publicKey) {
      throw new Error(
        'You must provide your Dynamic public key for verification.',
      );
    }

    this.verify = verify;

    // Passport expects this to be a callback. Our publicKey is static so
    // we wrap it in a simple function that returns it
    this._secretOrKeyProvider = (_request, _rawJwtToken, done) => {
      done(null, publicKey);
    };
  }

  authenticate(req: Request, _options?: any) {
    const token = this.jwtFromRequest(req);

    if (!token) {
      return this.fail('Missing JWT token', 401);
    }

    this._secretOrKeyProvider(
      req,
      token,
      (_secretOrKeyError: any, secretOrKey: Secret) => {
        return verifyToken(token, secretOrKey, (err, payload) => {
          if (err) {
            return this.fail('Invalid token', 401);
          } else {
            const verified = (error: any, user: object, info: object) => {
              if (error) {
                return this.error(error);
              } else if (!user) {
                return this.fail('User not found', 401);
              } else {
                return this.success(user, info);
              }
            };

            try {
              this.verify(payload, verified);
            } catch (ex: any) {
              return this.error(ex);
            }
          }
        });
      },
    );
  }

  jwtFromRequest(request: Request) {
    let jwtToken = null;

    const authHeader = request.headers.authorization;

    if (authHeader) {
      const bearerSchemeMatches = authHeader.match(this.authHeaderRegex);
      jwtToken = bearerSchemeMatches ? bearerSchemeMatches[2] : null;
    }

    return jwtToken;
  }
}
