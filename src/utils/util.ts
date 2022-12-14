/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-12-05 11:48:14
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-12-14 11:04:35
 * @FilePath: \web-downloader\src\utils\util.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function sumSpeed(size: number, duration: number): string {
  // console.log(size);
  // console.log(duration / 1000);
  // 计算下载速度 KBbyte/s
  let speed = size / 1024 / (duration / 1000);
  // console.log(speed);
  // console.log(Math.round(speed * 1024) / 1024);
  if (speed > 1024) {
    return Math.round((speed / 1024) * 100) / 100 + 'Mb/s';
  }
  return Math.round(speed * 100) / 100 + 'Kb/s';
}

export function sumProgress(accept: number, total: number): number {
  return Math.round((accept / total) * 100);
}

export function cloneObject(originObj: Object, excludeAttrs?: Array<string>) {
  const clonedObj = {};
  type keyType = keyof typeof originObj;
  Object.keys(originObj).forEach((key) => {
    if (
      !(excludeAttrs && excludeAttrs?.length > 0 && excludeAttrs.includes(key))
    ) {
      // clonedObj[key] = originObj[key]
      Object.defineProperty(clonedObj, key, {
        enumerable: true,
        value: originObj[key as keyType],
      });
    }
  });
  return clonedObj;
}
