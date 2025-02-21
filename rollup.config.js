import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts', // Update with your entry file
  output: {
    file: 'dist/bundle.js',
    format: 'cjs', // or 'esm' for ES Modules
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ],
};