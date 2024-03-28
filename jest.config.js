/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@configs/(.*)$": "<rootDir>/src/configs/$1",
    "^@database$": "<rootDir>/src/database",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@express$": "<rootDir>/src/configs/express",
    "^@aws$": "<rootDir>/src/configs/aws",
    "^@apiV1/(.*)$": "<rootDir>/src/api/v1/$1"
  },
};