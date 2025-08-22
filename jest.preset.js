const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  resolver: '@nx/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};