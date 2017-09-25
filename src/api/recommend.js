// 推荐页面的数据获取
import jsonp from 'common/js/jsonp' // 引入封装好的jsonp方法
import {commonParams, options} from './config' // commonParams是QQ音乐网站请求的一些一样的参数，我们在这个文件中做了一些封装,options是回调函数
import axios from 'axios'// 模拟请求头
// 轮播图数据
export function getRecommend () {
  // 第一个参数url
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // 第二个参数data，data就是需要往url后面拼接的参数
  const data = Object.assign({}, commonParams, {// 第二个参数是QQ音乐网站请求的一些一样的参数，我们在config.js文件中做了一些封装,第三个参数是不一样的参数，需要我们手动去写
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  // 通过封装好的方法请求数据
  // console.log(jsonp(url, data, options))
  return jsonp(url, data, options)// 1请求地址、2请求的参数、3回调函数,这个打出来是个promise对象
}

// 歌单数据
export function getDiscList () {
  // 第一个参数url
  const url = '/api/getDiscList'
  // 第二个参数data
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  // 通过封装好的方法请求数据
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })
  const option = {
    param: 'jsonpCallback',
    prefix: 'jp'
  }
  return jsonp(url, data, option)
}
