/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:45:01
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-12 10:17:07
 * @FilePath: \web-downloader\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite';
import * as fs from 'fs';
export default defineConfig({
  server: {
    port: 20236,
    https: {
      cert: fs.readFileSync('./cert.crt'),
      key: fs.readFileSync('./cert.key'),
    },
    // proxy: {
    //   '/v2': {
    //     target: 'https://disk.westone.com.cn/v2',
    //   },
    // },
  },
});
