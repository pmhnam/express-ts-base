/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@db$': '<rootDir>/src/database',
    '^@db/(.*)$': '<rootDir>/src/database/$1',
    '^@models$': '<rootDir>/src/models',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@express$': '<rootDir>/src/configs/express',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
};
