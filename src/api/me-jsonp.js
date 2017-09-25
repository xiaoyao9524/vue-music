export function getSongList (id) {
  const url = `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${id}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0&jsonpCallback=jp1`
  let js1 = document.createElement('script')
  js1.src = url
  document.body.appendChild(js1)
  js1.onload = function () {
    document.body.removeChild(js1)
  }
}

export function jp1(data) {
  console.log('hehe:', data)
}
