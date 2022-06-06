const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'passport-dynamic',
  license: 'MIT',
  copyrightOwner: 'Dynamic Labs',

  deps: ['passport@^0.5.2', 'jsonwebtoken@^8.5.1'],

  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'supertest@^6.2.3',
    '@types/supertest',
    '@types/passport@^1.0.7',
    '@types/jsonwebtoken@^8.5.8',
    '@types/express@4.17.13',
    'keypair',
    'express',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  releaseToNpm: true,
  repository: 'https://github.com/dynamic-labs/passport-dynamic.git',
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://registry.npmjs.org',
});
project.synth();
