/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:40:26
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-08 09:57:33
 * @FilePath: \web-downloader\rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ts from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';

const config = defineConfig([
  {
    input: './src/Downloader.ts',
    output: [
      {
        file: './dist/web-file-downloader.esm.js',
        format: 'module',
      },
      {
        file: './dist/web-file-downloader.umd.js',
        format: 'umd',
        name: 'web-downloader',
      },
    ],
    plugins: [
      ts(),
      terser({
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
  {
    input: './src/Downloader.ts',
    plugins: [dts()],
    output: {
      format: 'esm',
      file: 'dist/web-file-downloader.d.ts',
    },
  },
]);
export default config;
