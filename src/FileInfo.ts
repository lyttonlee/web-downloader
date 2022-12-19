/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 15:14:42
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-14 16:35:54
 * @FilePath: \web-downloader\src\FileInfo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createDownloadKey } from './utils/sm';
interface Info {
  url: string;
  fileName: string;
  hash?: string;
}

export enum status {
  PENGDING = 'PENGDING',
  DOWNLOADING = 'DOWNLOADING',
  END = 'END',
  PAUSE = 'PAUSE',
}

class FileInfo {
  url: string;
  fileName: string;
  hash: string;
  fileId: string;
  errorMsg: string;
  status: status;
  progress: number;
  startTime: number;
  size: number;
  accept: number;
  lastUpdateTime: number;
  speed: string;
  averageSpeed: string;
  blockLength: number;
  constructor(info: Info) {
    this.url = info.url;
    this.fileName = info.fileName;
    this.hash = info.hash || '';
    this.fileId = createDownloadKey(this.fileName);
    this.errorMsg = '';
    this.status = status.PENGDING;
    this.progress = 0;
    this.startTime = new Date().valueOf();
    this.size = 0;
    this.accept = 0;
    this.lastUpdateTime = 0;
    // 下载速度 更新时计算
    this.speed = '';
    // 平均速度
    this.averageSpeed = '';
    this.blockLength = 0;
  }
}

export default FileInfo;
