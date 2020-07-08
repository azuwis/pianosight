import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import workbox from 'rollup-plugin-workbox-inject';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/sw.js',
  output: {
    file: 'dist/service-worker.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    workbox({
      globDirectory: 'dist',
      globPatterns: [
        '**'
      ],
    }),
    terser(),
  ],
}
