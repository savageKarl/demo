interface ResponseResult<T> {
  data: T;
  code: number;
  msg: string
}

interface WxResponse<T> {
  data: ResponseResult<T>;
  statusCode: Object;
  header: Object;
  cookies: string[];
  profile: Object;
}

type RequestMethod = "POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT";

// 泛型T是api返回的data数据结构
function request<T>(url: string, params: any, method: RequestMethod = 'POST', contentType = false) {
  const header: any = {};
  header['content-type'] = contentType ? 'application/x-www-form-urlencoded' : 'application/json;charset=UTF-8';
  header['access-token'] = 'fMNAVqXLPiUaoUCplnNJMZSEiTvVYxJA';

  let data = {};
  for(let key in params) { 
    if(params[key] === 'null' || params[key] === null) delete params[key];
  }
  data = {...params};
  
  return new Promise<ResponseResult<T>>((resolve, reject) => {
    wx.request({
      url: `XXXXXXX${url}`,
      data: data,
      header: header,
      method: method,
      success: (response: WxResponse<T>) => (response.data.code === 1) && resolve(response.data) || reject(response.data),
      fail: err => reject(err),
    });
  });
}

export default request;
