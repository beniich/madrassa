/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/__tests__/**/!(*.vitest.)*.[jt]s?(x)', '**/!(*.vitest.)*?(*.)+(spec|test).[jt]s?(x)'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  verbose: true,
  testTimeout: 10000,
};
