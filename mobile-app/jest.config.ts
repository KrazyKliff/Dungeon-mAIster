/* eslint-disable */
export default {
  displayName: 'mobile-app',
  preset: '../jest.preset.js', // <--- FIX
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/mobile-app',
};
