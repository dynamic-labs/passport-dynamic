import { sign as jwtSign } from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import keypair from 'keypair';
import { verifyToken } from '../src/lib/verifyToken';

const keys = keypair();

describe('verifyToken', () => {
  const payload = { message: 'Hello' };
  const header = { alg: 'RS256', typ: 'JWT' };

  const body = {
    header: header,
    payload: payload,
    encoding: 'utf8',
  };

  const options = { algorithm: 'RS256' };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const generateJWT = (body: any, privateKey: any, options: any) => {
    return jwtSign(body, privateKey, options);
  };

  it('can decode a valid message', async () => {
    const signedToken = generateJWT(body, keys.private, options);

    verifyToken(signedToken, keys.public, (err: any, decoded: any) => {
      expect(err).toBeNull();
      expect(decoded.header).toEqual(header);
      expect(decoded.payload).toEqual(payload);
    });
  });

  it('returns an error if the token has not been signed with `RS256`', async () => {
    const otherOptions = { algorithm: 'RS512' };
    const signedToken = generateJWT(body, keys.private, otherOptions);

    verifyToken(signedToken, keys.public, (err: any, _decoded: any) => {
      expect(err?.message).toMatch('invalid algorithm');
    });
  });

  it('returns an error if public key is invalid', async () => {
    const signedToken = generateJWT(body, keys.private, options);

    verifyToken(signedToken, 'not a valid pem', (err: any, _decoded: any) => {
      expect(err?.message).toMatch(/secretOrPublicKey must be an asymmetric key when using RS256/);
    });
  });

  it('returns an error if public key does not match the private key', async () => {
    const otherKeypair = keypair();
    const signedToken = generateJWT(body, keys.private, options);

    verifyToken(signedToken, otherKeypair.public, (err: any, _decoded: any) => {
      expect(err?.message).toMatch('invalid signature');
    });
  });

  it('returns an error if the token is invalid', async () => {
    const signedToken = generateJWT('', keys.private, options);

    verifyToken(signedToken, keys.public, (err: any, _decoded: any) => {
      expect(err?.message).toMatch('invalid token');
    });
  });

  it('returns an error if the token is malformed `', async () => {
    const tokenParts = generateJWT('', keys.private, options).split('.');

    verifyToken(tokenParts[0], keys.public, (err: any, _decoded: any) => {
      expect(err?.message).toMatch('jwt malformed');
    });
  });

  it('returns an error if the token is expired `', async () => {
    const signedToken = generateJWT(
      { exp: Math.floor(Date.now() / 1000) - 60 },
      keys.private,
      options,
    );

    verifyToken(signedToken, keys.public, (err: any, _decoded: any) => {
      expect(err?.message).toMatch('jwt expired');
    });
  });
});
