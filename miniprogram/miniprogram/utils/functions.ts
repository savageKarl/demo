/** 成功提示框, 显示成功图标，此时 title 文本最多显示 7 个汉字长度 */
export function successToast(title: string) {
  wx.showToast({ title, mask: false, icon: 'success', duration: 2000 });
}

/** 消息提示框，不显示图标，此时 title 文本最多可显示两行 */
export function showToast(title: string) {
  wx.showToast({ title, mask: false, icon: 'none', duration: 2000 });
}

/** 显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框 */
export function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true });
}

/** 隐藏提示框  */
export function hideToast() {
  wx.hideLoading();
  wx.hideToast();
}

/** 判断是否身份证号码 */
export function isIdCard(val: string) {
  return /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(val);
}

/** 判断是否手机号码 */
export function isMobileNumber(val: string) {
  return /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(val);
}

/** 判断是否空对象 */
export function isEmptyObject(obj: Object) {
  if (obj == "undefined" || obj == null || obj == "" || obj == undefined || JSON.stringify(obj) == "{}") {
    return true;
  } else {
    return false;
  }
}

/** 设置本地持久化缓存 */
export function setLocalStorage(key: string, data: string | Object) {
  try {
    const _data = (typeof data === 'string') ? data : JSON.stringify(data);
    wx.setStorageSync(key, _data);
  } catch (e) {
    console.error(e);
  }
}

/** 获取本地持久化缓存 */
export function getLocalStorage(key: string) {
  try {
    const values = wx.getStorageSync(key);
    if (values === undefined || values === '') return '';
    return JSON.parse(values);
  } catch (e) {
    console.error(e);
  }
}

/** 删除本地持久化缓存 */
export function removeLocalStorage(key: string) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.error(e);
  }
}

/** 防抖 */
export function debounce(fn: Function, delay = 1500, immediate = true) {
  let timer: any = null;
  return function (this: any, ...args: any) {
    if (timer) clearTimeout(timer);
    if (immediate) {
      if (!timer) fn.apply(this, args);
      timer = setTimeout(() => timer = null, delay);
    } else {
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  }
}

/** 节流 */
export function throttle(fn: Function, delay = 1500, type: ('timer' | 'timestamp') = 'timestamp') {
  if (type === 'timestamp') {
    let prevTime = 0;
    return function (this: any, ...args: any) {
      const currentTime = Date.now();
      if (currentTime - prevTime > delay) {
        fn.apply(this, args);
        prevTime = currentTime;
      }
    }
  } else {
    let timer: any = null;
    return function (this: any, ...args: any) {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, args);
          timer = null;
        }, delay);
      }
    }
  }
}

/** 判断是否url */
export function isURL(val: string) {
  return /^http[s]?:\/\/.*/.test(val);
}

/** 序列化表单数据 */
export function serialize(data: { [index: string]: any }) {
  const list: string[] = [];
  Object.keys(data).forEach(val => {
    list.push(`${val}=${data[val]}`);
  });
  return list.join('&');
}

/** 
 * 判断一个日期是否在一个日期范围内
 * @param startDate 组成日期范围的开头日期
 * @param endDate 组成日期范围的结尾日期
 * @param targetDate 需要被判断的目标日期
 */
export function isDuringDate(startDate: string | Date, endDate: string | Date, targetDate: string | Date) {
  const sDate = (startDate instanceof Date) ? startDate :  new Date(startDate.replace(/-/g, startDate));
  const eDate = (endDate instanceof Date) ? endDate : new Date(endDate.replace(/-/g, endDate));
  const tDate = (targetDate instanceof Date) ? targetDate : new Date(targetDate.replace(/-/g, targetDate));
  if (tDate >= sDate && tDate <= eDate) return true;
  return false;
}

/** 打乱数组元素 */
export function shuffleArray(val: any[]) {
  let i = val.length;
  while (i--) {
    const j = Math.floor(Math.random() * i);
    [val[j], val[i]] = [val[i], val[j]];;
  }
  return val;
}