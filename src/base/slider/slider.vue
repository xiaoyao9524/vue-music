<template>
  <!--轮播图组件-->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from '../../common/js/dom'

  export default {
    data () {
      return {
        dots: [], // 下面的小点点
        currentPageIndex: 0 // 当前是第几张
      }
    },
    props: {
      loop: { // 是否循环播放
        type: Boolean,
        default: true
      },
      autoPlay: { // 是否自动播放
        type: Boolean,
        default: true
      },
      interval: { // 播放的间隔
        type: Number,
        default: 4000
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()// 计算宽度
        this._initDots()// 设置this.dots的长度用来渲染小点点
        this._initSlider()// 初始化better-scroll

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      // 当窗口大小改变时，重新计算轮播图宽度和better-scroll的滚动距离
      window.addEventListener('resize', () => {
        if (!this.slider) { // 如果better-scroll初始化未完成直接return
          return
        }
        this._setSliderWidth(true) // 重新计算轮播图宽度
        this.slider.refresh() // 重新计算better-scroll的滚动距离
      })
    },
    methods: {
      _setSliderWidth (isResize) { // 设置宽度
        this.children = this.$refs.sliderGroup.children  // 拿到一共有多少张图片
        let width = 0                                    // 初始化宽度
        let sliderWidth = this.$refs.slider.clientWidth  // 获取一张图片的宽度
        for (let i = 0; i < this.children.length; i++) { // for循环计算一共的宽度，有几张图片加几次
          let child = this.children[i]
          addClass(child, 'slider-item')  // 给每一张轮播图添加class:'slider-item'
          child.style.width = sliderWidth + 'px' // 让每一张轮播图宽度等于轮播图窗口的宽度
          width += sliderWidth
        }

        if (this.loop && !isResize) { // 如果是循环播放的话再加两张图片的宽度
          width += (2 * sliderWidth)
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true, // 开启横向滚动
          scrollY: false, // 关闭纵向滚动
          momentum: false, // 当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400 // 轮播图切换所需时间
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _play () {
        let pageIndex = this.currentPageIndex + 1// 计算下一张的张数
        // console.log('pageIndex:', pageIndex)
        if (this.loop) { // 如果为循环播放，那么+1
          /*
          *     这里循环模式为什么要+1呢？因为如果是非循环模式的话他一共是五张图片（五条数据为例），
          * 首次翻页是从第一张往第二张翻页，但是如果是循环模式，better-scroll会帮我们把第一张和最后
          * 一张拷贝一份也就是一共五条数据七张图片，那么首次翻页就不是从第一张往第二张翻页而是从第二
          * 张往第三张翻页，所以要+1
          * */
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
