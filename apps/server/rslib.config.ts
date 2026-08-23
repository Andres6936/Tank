import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: ['./entry.ts'],
    },
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    target: 'node',
  }
});
