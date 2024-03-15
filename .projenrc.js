const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@dynamic-labs/passport-dynamic',
  license: 'MIT',
  copyrightOwner: 'Dynamic Labs',

  deps: ['passport-strategy', 'jsonwebtoken@^9.0.2'],

  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'supertest@^6.2.3',
    '@types/supertest',
    '@types/passport',
    '@types/passport-strategy',
    '@types/jsonwebtoken@^9.0.2',
    '@types/express@4.17.13',
    'keypair',
    'express',
    'passport',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  releaseToNpm: true,
  repository: 'https://github.com/dynamic-labs/passport-dynamic.git',
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://registry.npmjs.org',
  packageManager: 'npm',
});
project.synth();
