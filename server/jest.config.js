/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  maxWorkers: '50%'
}

module.exports = config;