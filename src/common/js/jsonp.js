import originJSONP from 'jsonp' // 通过npm安装的jsonp组件

// 通过ES6的Promise和引入的jsonp组件封装jsonp方法
export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data) // 如果URL后面没有'?'那么就拼上'?',如果没有就拼上'&',后面再拼上请求的参数
  return new Promise((resolve, reject) => { // 如果成功的话调用resolve,否则调用reject
    originJSONP(url, option, (err, data) => { // err如果为null的话就是成功
      if (!err) { // 说明成功
        resolve(data)
      } else { // 说明不成功
        reject(err)
      }
    })
  })
}

function param (data) { // 将data拼接到url上
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
