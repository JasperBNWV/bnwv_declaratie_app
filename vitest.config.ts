import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts',
        coverage: {
            thresholds: { lines: 80, functions: 80, branches: 70 }
        }
    }
})
