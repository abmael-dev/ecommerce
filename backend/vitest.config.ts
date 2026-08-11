import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        'src/database/prisma/seed.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
    setupFiles: ['./tests/helpers/setup.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@config': resolve(__dirname, './src/config'),
      '@shared': resolve(__dirname, './src/shared'),
      '@modules': resolve(__dirname, './src/modules'),
      '@middlewares': resolve(__dirname, './src/middlewares'),
      '@database': resolve(__dirname, './src/database'),
      '@cache': resolve(__dirname, './src/cache'),
    },
  },
})
