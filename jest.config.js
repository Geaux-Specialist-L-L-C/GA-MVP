/** @type {import('jest').Config} */
// File: /jest.config.js
// Description: Jest configuration file for the project.

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.json' }],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|react-icons)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.d\\.ts$'
  ],
  watchPathIgnorePatterns: ['node_modules', 'dist', '.git']
};