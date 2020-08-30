const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  clearMocks: true,

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),

  preset: '@shelf/jest-mongodb',

  testEnvironment: 'node',

  modulePathIgnorePatterns: ["tests/model/dist"]
}
