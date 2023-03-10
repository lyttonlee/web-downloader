/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-02 13:37:34
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-14 16:39:06
 * @FilePath: \web-downloader\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// .
import WebDownloader, { eventName, DownloadException } from './src/Downloader';
import FileInfo from './src/FileInfo';
const files = [
  {
    url: '/files/netdisk.exe',
    fileName: 'netdisk.exe',
  },
  {
    url: '/files/check.zip',
    fileName: 'check.zip',
  },
  {
    url: '/files/git.exe',
    fileName: 'git.exe',
  },
  {
    url: '/files/全战三国1.7dlc及补丁.rar',
    fileName: '全战三国1.7dlc及补丁.rar'
  }
];

const app = document.getElementById('app');

let bars: Map<string, HTMLParagraphElement> = new Map();

files.forEach((file) => {
  let li = document.createElement('li');
  li.innerText = file.fileName;
  let btn = document.createElement('button');
  btn.innerText = `下载`;
  btn.onclick = function () {
    const bar = document.createElement('p');
    bar.setAttribute('id', file.fileName);
    bar.style.background = '#000';
    bar.style.width = '100%';
    bar.style.height = '35px';
    bar.style.color = '#fff';
    // let progress = document.createElement('div');
    // progress.style.width = '0';
    // progress.style.background = 'green';
    // progress.style.height = '35px';
    // bar.appendChild(progress);
    bars.set(file.fileName, bar);
    li.append(bar);
    let fileInfo = downloader.download(file.url, file.fileName);
    let pauseBtn = document.createElement('button');
    let controlBtnText = 'pause';
    pauseBtn.innerText = controlBtnText;
    li.append(pauseBtn);
    pauseBtn.onclick = function () {
      if (controlBtnText === 'pause') {
        downloader.pause(fileInfo.fileId);
        controlBtnText = 'start';
        pauseBtn.innerText = controlBtnText;
      } else {
        downloader.start(fileInfo.fileId);
        controlBtnText = 'pause';
        pauseBtn.innerText = controlBtnText;
      }
    };
  };
  li.append(btn);

  app?.appendChild(li);
});

const customHeader = new Headers();

customHeader.set('token', '12121212');
customHeader.set('platform', 'WEB');

const downloader = new WebDownloader({
  maxDownloadConnect: 5,
  fileChunkSize: 5 * 1024 * 1024,
  header: customHeader,
});

let callback = (info: FileInfo) => {
  let el = bars.get(info.fileName);
  if (el) {
    let time = ((info.lastUpdateTime - info.startTime) / 1000).toFixed(2);
    let accept = (info.accept / 1024 / 1024).toFixed(2);
    let total = (info.size / 1024 / 1024).toFixed(2);
    el.innerText = `speed: ${info.averageSpeed}, 耗時： ${time}秒， 大小：${accept}Mb / ${total}Mb`;
    el.style.width = `${info.progress}%`;
    // if (el.firstElementChild) {
    //   el.firstElementChild.setAttribute(
    //     'style',
    //     `width: ${info.progress}%; background: green;height: 35px`
    //   );
    //   // el.children[0].style.width = `${info.progress}%`;
    // }
  }
};

downloader.on(eventName.progress, callback);

downloader.on(eventName.error, (err: DownloadException) => {
  console.log(err)
})

// setTimeout(() => {
//   downloader.off(eventName.progress, callback);
// }, 10000);
