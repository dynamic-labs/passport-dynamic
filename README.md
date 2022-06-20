# Passport README

A [Passport.js](https://www.passportjs.org/) strategy for authenticating with dynamic.xyz

## Installation

```shell
npm install --save @dynamic-labs/passport-dynamic
```

```shell
yarn add @dynamic-labs/passport-dynamic
```

## Usage

The token has to be sent as part of the authorization header with the ‘bearer’ scheme (e.g `Authorization: Bearer ${token}`)

### How to access the JWT token provided by Dynamic?

When a user is authenticated, the JWT is available through the `authToken` method of the [Dynamic SDK](https://docs.dynamic.xyz/docs/methods-objects)

## Configuration & setup

```javascript
new DynamicStrategy(options, verify);
```

### Options

`publicKey`

The publicKey from Dynamic used by passport to validate the authenticity of the JWT and ensure that it has not been tampered with. It needs to be a string with no whitespaces can be parsed into a valid PEM, e.g:

```javascript
const publicKey = `-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEArplf0W2SNo6PR9xXv7HgYyuoQ9fedrP/flHatSgV2RbySQMz0G6DoiqBwe/woq7X0EyfLJwS9vcvgSks3mGRndfVwyKM5dTTJn0TGos2QLy5bHcjuIJtu1CAv9xcge3FpDEIi7fzo+Lt5eDA92e/TvhSAUS7CZhLMgjPau8Lr8UB+pg0NcGrQpRV7FikZ3ner7uZy6JpxKBS+oOCd7EZz+gOdCJWTl6FsEPHU0R2ei0FL+ng5eDECr0VCfNysnicY87OHM5hzWKt/nItv0Ai+9efztpwBSzWlOUWyMCC3HR4b+MZvzHP9z61OKGuOrlhC5qqmaXuIv8GRuapfiCH6QIDAQAB\n-----END RSA PUBLIC KEY-----`;
```


### Verify

`verify` is a function with the parameters `verify(payload, done)`

- `payload` is an object literal containing the decoded token
- `done` is a passport callback accepting arguments done(error, user, info)

Example:

```jsx
passport.use(new DynamicStrategy(options, (payload, done) => {
	try {
		const user = { id: 1, email: "hello@example.com" }

		if (user) {
			return done(null, user)
		} else {
			return done(null, false)
		}
	} catch (err) {
		return done(err, false);
	}
}
```

## Tests

```shell
npm test
```

## Contributing

Coming soon
