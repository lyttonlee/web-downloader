<!--
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:41:41
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-07 17:30:45
 * @FilePath: \web-downloader\readme.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

## Web Downloader

### use

```
npm i web-downloader --save
```

in javascript

```
import WebDownloader from 'web-downloader'

const downloader = new WebDownloader()

const fileInfo = downloader.download(url: string, fileName: string)

downloader.on('progress', info => {
  // useful info in info like speed progress duration ...
})

```
