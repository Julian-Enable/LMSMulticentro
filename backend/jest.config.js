/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@types/uuid)/)'
  ],
  moduleNameMapper: {
    '^express-rate-limit$': '<rootDir>/src/tests/__mocks__/express-rate-limit.ts',
    '^uuid$': '<rootDir>/src/tests/__mocks__/uuid.ts'
  }
};
