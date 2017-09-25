import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  // 播放器相关数据：
  playing: false, // 是否播放
  fullScreen: false, // 是否全屏播放
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式（顺序、循环、随机播放...）
  currentIndex: -1, // 当前播放的索引
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
