export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [ 'ts', 'js' ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.(ts)$': ['ts-jest', {
      babel: true,
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: [ '**/__tests__/*.+(ts|js)' ]
}
