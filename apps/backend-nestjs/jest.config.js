module.exports = {
  displayName: 'backend-nestjs',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/backend-nestjs',
  collectCoverageFrom: ['**/*.(t|j)s'],
  testRegex: '.*\\.spec\\.ts$',
};