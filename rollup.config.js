import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import inject from 'rollup-plugin-inject';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';


export default {
  entry: 'index.js',
  dest: 'meme-app.js',
  format: 'iife',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        'es2015-rollup',
        'react',
      ],
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    inject({
      exclude: 'node_modules/**',
      $: 'jquery',
    }),
  ],
  external: ['jquery'],
  globals: {
    jquery: '$',
  },
};
