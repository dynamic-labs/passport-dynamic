import { sign as jwtSign } from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import keypair from 'keypair';
import passport from 'passport';
import { DynamicStrategy } from '../src/lib/dynamicStrategy';
import { testServer } from '../src/test/TestServer';

const keys = keypair();

const user = {
  chain: 'ETH',
  environmentId: 'fb6dd9d1-09f5-43c3-8a8c-eab6e44c37f9',
  lists: [],
  userId: '382c1002-e9c1-4fc1-b17c-a887b693b940',
  wallet: 'metamask',
  walletPublicKey: '0x9249Ecdc1c83e5479289e0bDD9AB96738C51C9Da',
};

const defaultOptions = { publicKey: keys.public };
const passportVerify = async (decodedToken: any, done: any) => {
  try {
    return done(null, decodedToken.payload);
  } catch (err) {
    return done(err, false);
  }
};

const usePassport = (
  options: any = defaultOptions,
  verifyCallback = passportVerify,
) => {
  passport.use(new DynamicStrategy(options, verifyCallback));
};

describe('DynamicStrategy', () => {
  afterEach(() => {
    passport.unuse('dynamicStrategy');
  });

  const generateJWT = (alg = 'RS256') => {
    const header = { alg: alg };
    const payload = user;
    const signedToken = jwtSign(
      {
        header: header,
        payload: payload,
        encoding: 'utf8',
      },
      keys.private,
      { algorithm: 'RS256' },
    );

    return signedToken;
  };

  it('throws an error if the strategy does not have a `publicKey`', async () => {
    expect(() => {
      usePassport({});
    }).toThrowError(
      'You must provide your Dynamic public key for verification.',
    );
  });

  it('returns 401 if no header is provided', async () => {
    usePassport();

    const response = await (await testServer).app.get('/user');

    expect(response.status).toEqual(401);
    expect(response.headers['www-authenticate']).toEqual('Missing JWT token');
  });

  it('returns 401 if the Authorization header has no value', async () => {
    usePassport();

    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', '');

    expect(response.status).toEqual(401);
    expect(response.headers['www-authenticate']).toEqual('Missing JWT token');
  });

  it('returns 401 if the Authorization header does not match the Bearer format', async () => {
    usePassport();

    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', 'Bearer');

    expect(response.status).toEqual(401);
    expect(response.headers['www-authenticate']).toEqual('Missing JWT token');
  });

  it('returns 401 if the JWT is invalid', async () => {
    usePassport();

    const signedToken = 'Token';
    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', `Bearer ${signedToken}`);

    expect(response.status).toEqual(401);
    expect(response.headers['www-authenticate']).toEqual('Invalid token');
  });

  it('returns 500 if the verify callback throws an error', async () => {
    const errorVerify = (_payload: any, _done: any) => {
      throw new Error('Bad API');
    };

    usePassport(defaultOptions, errorVerify);

    const signedToken = generateJWT();
    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', `Bearer ${signedToken}`);

    expect(response.status).toEqual(500);
    expect(response.body.error).toEqual('Bad API');
  });

  it('returns 500 if the the verify callback returns an error', async () => {
    const errorVerify = async (_payload: any, done: any) => {
      return done(new Error('Unexpected error'), false);
    };

    usePassport(defaultOptions, errorVerify);

    const signedToken = generateJWT();
    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', `Bearer ${signedToken}`);

    expect(response.status).toEqual(500);
    expect(response.body.error).toEqual('Unexpected error');
  });

  it('returns 401 if the verify callback does not return a user', async () => {
    const verifyNoUser = async (_payload: any, done: any) => {
      return done(null, false);
    };

    usePassport(defaultOptions, verifyNoUser);

    const signedToken = generateJWT();
    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', `Bearer ${signedToken}`);

    expect(response.status).toEqual(401);
    expect(response.headers['www-authenticate']).toEqual('User not found');
  });

  it('returns 200 if the user can be authenticated', async () => {
    usePassport();

    const signedToken = generateJWT();
    const response = await (await testServer).app
      .get('/user')
      .set('Authorization', `Bearer ${signedToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(user);
  });
});
