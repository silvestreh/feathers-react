import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import svgr from '@svgr/rollup';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({ exclude: 'node_modules/**' }),
    resolve(),
    commonjs(),
    terser(),
    filesize(),
    copy({
      targets: [
        { src: 'src/style.css', dest: 'dist/' },
        { src: 'src/index.d.ts', dest: 'dist/' }
      ]
    })
  ]
};
