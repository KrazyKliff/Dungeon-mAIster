/* eslint-disable */
export default {
  displayName: 'database',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^[\.](ts|js)$ ': ['@swc/jest', { swc: { jsc: { parser: { syntax: 'typescript' } } } }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/database',
};
