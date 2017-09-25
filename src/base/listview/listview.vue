<template>
<!--列表组件-->
  <scroll class="listview"
          ref="listview"
          :data="data"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!----------右侧列表----------------->
    <div class="list-shortcut"
         @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :class="{'current':currentIndex===index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18 // 右侧每一项的高度
  const TITLE_HEIGHT = 30 // 左侧每一项title的高度

  export default {
    created () {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: { // 这个data是从父组件singer传过来的已经处理好的歌手列表数据
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortcutTouchStart (e) {
        // console.log(e.target) // e就是默认的$event对象
        let anchorIndex = getData(e.target, 'index') // 其实就是获取触摸元素的自定义属性"data-index"的值
//        console.log(anchorIndex)
        let firstTouch = e.touches[0] // 获取第一根手指(多指操作的第一根)
        this.touch.y1 = firstTouch.pageY // 获取第一个手指按下的位置
        this.touch.anchorIndex = anchorIndex // 获取第一根手指按下的元素的下标
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = parseInt((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        console.log('anchorIndex', anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll (scrollPosition) { // 监控scroll组件滚动的y值
        this.scrollY = scrollPosition.y
      },
      _scrollTo (index) {
        // console.log(index)// 注意传进来的index是一个字符串不是数字
        // console.log(this.listHeight) // 24
        if (!index && index !== 0) { // 判断点击的是不是空白,排除掉未传值或传进来值为null
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2 // 为什么-2，因为listHeight.length是24，一共有23个元素，因为有个初始的值为0而且每个元素push一次高度所以length多了一个
        }
        // console.log(index)
        this.scrollY = -this.listHeight[index] // 重新计算滚动距离
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 让列表滚动到点击元素对应的位置
      },
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        // console.log(this.listHeight)
      },
      selectItem (item) {
        this.$emit('select', item)
      },
      refresh () {
        this.$refs.listview.refresh()
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight() // 计算左侧各li的高度，生成数组
        }, 20)
      },
      scrollY (newY) { // 每当页面滚动就会触发
        // console.log(newY) // 监控的哪个值参数就是那个值,newY就是滚动的y值
        const listHeight = this.listHeight
        // 当滚动到顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY) >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
//            console.log(height2, newY, this.diff)
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>
