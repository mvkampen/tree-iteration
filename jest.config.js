export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [ 'ts', 'js' ],
  transform: {
    '^.+\\.(ts)$': ['ts-jest', {
      babel: true,
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: [ '**/__tests__/*.+(ts|js)' ]
}