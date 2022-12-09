<!--
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:41:41
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-09 16:17:47
 * @FilePath: \web-downloader\readme.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

## Web File Downloader

### use

```
npm i web-file-downloader --save
```

in javascript

```
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

### surport multi files
