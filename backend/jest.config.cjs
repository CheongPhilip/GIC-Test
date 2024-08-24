const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './test/.env') });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@backend/(.*)$": "<rootDir>/../backend/$1",
    "^@frontend/(.*)$": "<rootDir>/../frontend/$1",
    "^@shared/(.*)$": "<rootDir>/../shared/$1",
  },
};