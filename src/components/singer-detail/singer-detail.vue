<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    components: {
      MusicList
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      }
    },
    created () {
      this._getDetail()
//      console.log(this.singer)
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer') // 如果在子路由刷新，则返回到singer
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
//            console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item // ES6语法，相当于：let musicData = item.musicData
//          console.log(musicData)
          if (musicData.songid && musicData.albummid) {
//            console.log(createSong(musicData))
            ret.push(createSong(musicData))
//            console.log(ret)
          }
        })
        // console.log(ret)
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
    transition: all 0.3s

  .slide-enter,.slide-leave-to
    transform: translate3d(100%,0,0)
</style>
