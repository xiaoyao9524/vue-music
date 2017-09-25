// 原则是和原网站保持一致
export const commonParams = { // 通用的参数，这些都要拼在url后面（请求这个网站数据很多参数都是一样的，所以把它抽出来封装一下）
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = { // 从npm上下载的jsonp组件的options参数，代表jsonp的回调函数
  param: 'jsonpCallback'
}

export const ERR_OK = 0 // 0代表正确请求
