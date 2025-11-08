import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.js',
        '**/test-*.js',
        'scripts/build.mjs',
        'scripts/version.js',
        'scripts/logger.js'
      ],
      include: [
        'scripts/**/*.js'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    },
    include: ['tests/**/*.test.js', 'scripts/**/*.test.js'],
    exclude: ['node_modules', 'dist']
  }
});
