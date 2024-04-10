/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@configs/(.*)$": "<rootDir>/src/configs/$1",
    "^@database$": "<rootDir>/src/configs/database",
    "^@database/(.*)$": "<rootDir>/src/configs/database/$1",
    "^@models$": "<rootDir>/src/configs/database/models",
    "^@models/(.*)$": "<rootDir>/src/configs/database/models/$1",
    "^@express$": "<rootDir>/src/configs/express",
    "^@apiV1/(.*)$": "<rootDir>/src/api/v1/$1",
    "^@modulesV1/(.*)$": "<rootDir>/src/api/v1/modules/$1",
    "^@utilsV1/(.*)$": "<rootDir>/src/api/v1/utils/$1",
    "^@coreModuleV1/(.*)$": "<rootDir>/src/api/v1/core/$1",
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
};