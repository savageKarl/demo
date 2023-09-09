export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export function debounce(fn: Function, delay = 1000, fristTrigger = true) {
  let timer: any = null;
  return function () {
    if (timer) clearTimeout(timer);
    if (fristTrigger) {
      if (!timer) {
        console.debug('第一次触发');
        fn.apply(this, arguments)
      };
      timer = setTimeout(() => timer = null, delay);
    } else {
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    }
  }
}
