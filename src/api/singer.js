// 歌手页面的数据获取
import jsonp from 'common/js/jsonp' // 引入封装好的jsonp方法
import {commonParams, options} from './config' // 请求数据需要的两个对象，从网站上扒
// 获取歌手的信息
export function getSingerList () {
  // 第一个参数url
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  // 第二个参数data
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 5381
  })
  // 通过封装好的方法请求数据
  return jsonp(url, data, options)
}
// 获取歌手的歌曲信息
export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNerCode: 0,
    platform: 'yqq',
    order: 'listen',
    num: 100,
    songstatus: 1,
    g_tk: 1500290960,
    singermid: singerId
  })
  return jsonp(url, data, options)
}
