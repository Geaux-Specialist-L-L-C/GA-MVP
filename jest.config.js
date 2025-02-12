/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.d\\.ts$'
  ]
};