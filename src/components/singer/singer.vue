<template>
<div class="singer" ref="singer">
  <list-view @select="selectSinger" :data="singers" ref="singerList"></list-view>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer' // 获取数据
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer' // new的Singer类
  import listView from 'base/listview/listview'
  import {mapMutations} from 'vuex' // 语法糖，对mutations做了一些封装
  import {playListMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playListMixin],
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingetList()
    },
    methods: {
      _getSingetList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            // console.log(this.singers)
          }
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => { // 循环每一项
          if (index < HOT_SINGER_LEN) { // 如果条数小于热门的条数（10条）
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // console.log(map)
        // 为了得到有序列表，我们需要处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
//         console.log(hot)
//         console.log(ret)
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      selectSinger (singer) {
//        console.log(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer) // 实现了对mutations的提交
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlayList (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.singerList.refresh()
      }
    },
    components: {
      listView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
