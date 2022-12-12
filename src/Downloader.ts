/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:41:26
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-12 11:15:32
 * @FilePath: \web-downloader\src\Downloader.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import FileInfo, { status } from './FileInfo';
import { sumProgress, sumSpeed } from './utils/util';

interface Option {
  fileChunkSize?: number;
  maxDownloadConnect?: number;
  header?: Headers;
}

interface QueueItem {
  index: number;
  fileInfo: FileInfo;
}
export enum eventName {
  progress = 'progress',
}

// type eventName = 'progress'

class WebDownloader {
  // 分片下载的大小 bytes
  private fileChunkSize: number;
  // 下载最大连接数
  private maxDownloadConnect: number;
  // 下载的文件列表
  private downloadList: Array<FileInfo>;
  // 下载的请求队列，每次添加新文件下载时，会默认切片后推入下载队列
  private fetchQueue: Array<QueueItem>;
  // private fetchMap: Map<string, Array<QueueItem>>;
  private userHeader: Headers | undefined;
  // 正在被使用的下载连接数
  private usedConnect: number;
  // 失败异常的请求队列
  private exceptionQueue: Array<QueueItem>;
  // 监听下载进度回调事件
  private progressFn: Array<Function>;
  constructor(option?: Option) {
    this.fileChunkSize = option?.fileChunkSize || 5 * 1024 * 1024;
    this.maxDownloadConnect = option?.maxDownloadConnect || 5;
    this.userHeader = option?.header;
    this.downloadList = [];
    this.fetchQueue = [];
    // this.fetchMap = new Map();
    this.exceptionQueue = [];
    this.usedConnect = 0;
    this.progressFn = [];
    this.init();
  }

  private init() {
    try {
      this.checkEnv();
    } catch (error) {}
  }

  private checkEnv() {
    if (!fetch) {
      throw new Error(`不支持fetch请求，请升级浏览器！`);
    }
  }

  public on(type: eventName, callback: Function) {
    if (type in eventName) {
      this.progressFn.push(callback);
    } else {
      throw new Error(`不支持的事件名: ${type} !`);
    }
  }

  public off(type: eventName, callback: Function) {
    if (type in eventName) {
      let fnIndex = this.progressFn.findIndex((fn) => fn === callback);
      if (fnIndex !== -1) {
        this.progressFn.splice(fnIndex, 1);
      } else {
        throw new Error('未注册的回调函数');
      }
    } else {
      throw new Error(`不支持的事件名: ${type} !`);
    }
  }

  public clearAllEvent() {
    this.progressFn = [];
  }

  // 下载暂停事件
  public pause(id: string) {
    // 1. 查找下载队列中该id的所有任务
    // 创建temp数组
    let tempFetchQueue: Array<QueueItem> = [];
    this.fetchQueue.forEach((item) => {
      let isTargetFile: boolean = item.fileInfo.fileId === id;
      if (isTargetFile) {
        // 将需要暂停的下载添加到 异常队列
        this.exceptionQueue.push(item);
      } else {
        // 无需暂停的加载到缓存数组中
        tempFetchQueue.push(item);
      }
    });
    // 将缓存数组重新赋值为下载队列
    this.fetchQueue = tempFetchQueue;
  }

  // 重新開始下載事件 start
  public start(id: string) {
    console.log(id);
    // 1. 判斷找出異常隊列中存在該id的任務
    // 创建temp数组
    let tempExceptionQueue: Array<QueueItem> = [];
    this.exceptionQueue.forEach((item) => {
      const isTargetFile: boolean = item.fileInfo.fileId === id;
      if (isTargetFile) {
        // 2. 將對應任務寫入到下載隊列頭部
        this.fetchQueue.unshift(item);
      } else {
        tempExceptionQueue.push(item);
      }
    });
    // 完成后将temp数组重新赋值给异常下载队列
    this.exceptionQueue = tempExceptionQueue;

    this.checkDownload();
  }

  public delete(id: string) {
    // ..
    console.log(id);
    this.fetchQueue = this.fetchQueue.filter(
      (item) => item.fileInfo.fileId !== id
    );
    this.exceptionQueue = this.exceptionQueue.filter(
      (item) => item.fileInfo.fileId !== id
    );
    // 清楚記錄
    const index = this.downloadList.findIndex((item) => item.fileId === id);
    this.downloadList.splice(index, 1);
  }

  public download(url: string, fileName: string, hash?: string) {
    const fileInfo = new FileInfo({
      url,
      fileName,
      hash,
    });
    this.downloadList.push(fileInfo);
    this.downloadFile(fileInfo);
    return fileInfo;
  }

  private async downloadFile(fileInfo: FileInfo) {
    try {
      const fileSize = await this.getFileTotalSize(fileInfo);
      fileInfo.size = fileSize;
      // 构建分片下载
      let slices = Math.ceil(fileInfo.size / this.fileChunkSize);
      fileInfo.blockLength = slices;
      let fetchArray = [];
      for (let index = 0; index < slices; index++) {
        fetchArray.push({
          index,
          fileInfo,
        });
      }
      this.fetchQueue.push(...fetchArray);
      // this.fetchMap.set(fileInfo.fileId, fetchArray);

      // 检查资源开始下载
      this.checkDownload();
    } catch (error) {
      fileInfo.errorMsg = '获取文件长度失败！';
    }
  }

  private async checkDownload() {
    // 当分片队列中有任务 且 当前被占用的下载连接数小于最大可用连接时，执行下载
    if (
      this.fetchQueue.length > 0 &&
      this.usedConnect < this.maxDownloadConnect
    ) {
      let remainConnect = this.maxDownloadConnect - this.usedConnect;
      console.log(`当前剩余请求下载长度： ${this.fetchQueue.length}`);
      console.log(`正在下载的请求数： ${this.usedConnect}`);
      console.log(`本次可用请求数: ${remainConnect}`);
      for (let index = 0; index < remainConnect; index++) {
        const curDownload = this.fetchQueue.shift();
        if (curDownload) {
          let fileInfo = curDownload.fileInfo;
          try {
            this.usedConnect++;
            let start = new Date().valueOf();
            if (curDownload.index === 0) {
              curDownload.fileInfo.startTime = start;
            }
            const buffer = await this.getFileChunk(
              curDownload?.fileInfo,
              curDownload?.index
            );

            fileInfo.chunks.set(curDownload.index, buffer);
            fileInfo.accept = fileInfo.accept + buffer.byteLength;
            let now = new Date().valueOf();
            // console.log(now - start);
            fileInfo.speed = sumSpeed(buffer.byteLength, now - start);
            console.log(fileInfo.speed);
            fileInfo.progress = sumProgress(fileInfo.accept, fileInfo.size);
            console.log(fileInfo.progress);

            fileInfo.lastUpdateTime = new Date().valueOf();
            fileInfo.averageSpeed = sumSpeed(
              fileInfo.accept,
              fileInfo.lastUpdateTime - fileInfo.startTime
            );
            console.log(fileInfo.averageSpeed);
            if (curDownload.index === 0) {
              fileInfo.status = status.DOWNLOADING;
            }
            if (fileInfo.size === fileInfo.accept) {
              fileInfo.status = status.END;
              this.saveFile(fileInfo);
            }
            if (this.progressFn.length > 0) {
              this.progressFn.forEach((fn) => fn(fileInfo));
            }
            this.usedConnect--;
          } catch (error) {
            console.log(error);
            this.usedConnect--;
            curDownload.fileInfo.errorMsg = `获取分片${curDownload.index}失败`;
            this.exceptionQueue.push({
              fileInfo: curDownload.fileInfo,
              index: curDownload.index,
            });
            this.pause(curDownload.fileInfo.fileId);
          }
          // 繼續下載文件
          this.checkDownload();
        }
      }
    }
  }

  private saveFile(info: FileInfo) {
    // 1. 拼接文件
    console.log(info);
    let result = new Uint8Array(info.size);
    let offset = 0;
    for (let i = 0; i < info.chunks.size; i++) {
      let buffer = info.chunks.get(i);
      if (buffer) {
        let buf = new Uint8Array(buffer);
        result.set(buf, offset);
        offset += buf.length;
      }
    }
    // 2. 下載文件
    const blod = new Blob([result]);
    const a = document.createElement('a');
    const url = URL.createObjectURL(blod);
    a.href = url;
    a.download = info.fileName;
    a.click();
    // 釋放url
    URL.revokeObjectURL(url);
    // 清楚記錄
    const index = this.downloadList.findIndex(
      (item) => item.fileId === info.fileId
    );
    this.downloadList.splice(index, 1);
  }

  private getFileTotalSize(fileInfo: FileInfo): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.userHeader) {
          console.log(this.userHeader);
        }
        // debugger;
        const headRes = await fetch(fileInfo.url, {
          method: 'head',
          headers: Object.assign({}, this.userHeader),
        });
        console.log(headRes.statusText);
        if (
          headRes.statusText.toLowerCase() === 'ok' ||
          headRes.status === 200
        ) {
          let contentSize = headRes.headers.get('content-length');
          console.log(contentSize);
          resolve(Number(contentSize));
        } else {
          fileInfo.errorMsg = '获取文件长度失败！';
          throw new Error(`获取文件长度失败！`);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private getFileChunk(
    fileInfo: FileInfo,
    index: number
  ): Promise<ArrayBuffer> {
    return new Promise(async (resolve, reject) => {
      try {
        let start = index * this.fileChunkSize;
        let originEnd = start + this.fileChunkSize - 1;
        let end = originEnd >= fileInfo.size ? fileInfo.size - 1 : originEnd;
        if (this.userHeader) {
          this.userHeader.set('range', `bytes=${start}-${end}`);
        } else {
          this.userHeader = new Headers();
          this.userHeader.set('range', `bytes=${start}-${end}`);
        }

        const chunk = await fetch(fileInfo.url, {
          method: 'get',
          headers: this.userHeader,
        });
        // console.log(chunk);
        const buffer = await chunk.arrayBuffer();
        // console.log(buffer);
        resolve(buffer);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default WebDownloader;
