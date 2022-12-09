/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 14:37:48
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-09 15:36:55
 * @FilePath: \web-downloader\src\utils\sm.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { sm3sum } from './sm3';

export function createDownloadKey(fileName: string) {
  const timeStamp = new Date().valueOf();
  return sm3sum(`${timeStamp}:${fileName}`);
}

// export function sumHash(
//   input: ArrayBuffer | ArrayBufferView | Uint8Array | File
// ) {
//   console.log(sm3sum(input));
//   return sm3sum(input);
// }
