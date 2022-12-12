<!--
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:41:41
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-12 11:46:56
 * @FilePath: \web-downloader\readme.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

## Web File Downloader

### use

```
npm i web-file-downloader --save
```

in brower

```javascript
import WebFileDownloader from 'web-file-downloader'

const option = {
  maxDownloadConnect: 5,
  fileChunkSize: 5 * 1024 * 1024
}

const downloader = new WebFileDownloader(option)

const fileInfo = downloader.download(url: string, fileName: string)

downloader.on('progress', info => {
  // useful message in info eg. speed progress duration ...
})

// fileId can get from fileInfo

downloader.pause(id: fileId)

downloader.start(id)

downloader.delete(id)

```

### option param

**option.maxDownloadConnect**: the max async request number when download at same time, default value 5 .

> notice: if you use http1.1 this value should not over 5, if use http2 you can set this value according to your requirements

**option.fileChunkSize**: downloader download file use range header split file to multi chunks, this value can set the one chunk size, this value affect how much chunks will be split, default value is 5 _ 1024 _ 1024 means one chunk is 5mb

**option.header**: the request header, you can use new Headers() to get a header instance, then append or set you custom header attr, eg token

```js
const header = new Headers();
header.set('token', 'your-token');
```

### function

**download(url, fileName)**: use instance.download() to download file,when download end ,the file will be save, and the base info will be return, you can get a useful attr fileId in return value

**on(event, callback)**: listen download event, now only surport 'progress' event, the callback param is the a download info, you can get many useful info eg statu speed progress ...

**pause(fileId)**: pause downloading file

**start(fileId)**: if this download is paused, run start will be in downloading

**delete(fileId)**: delete the download task

### surport multi files

### feature

1. check file hash
2. web worker
