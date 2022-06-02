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

The publicKey from Dynamic used by passport to validate the authenticity of the JWT and ensure that it has not been tampered with.

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
