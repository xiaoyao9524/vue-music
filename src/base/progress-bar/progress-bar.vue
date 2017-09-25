<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend.prevent="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const tranform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progressTouchStart (e) {
        this.touch.initiated = true // 初始化,说明手指已经按下
//        console.log(this.$refs.progress.clientWidth)
        this.touch.startX = e.touches[0].pageX // 记录第一根手指按下的位置(距离屏幕左侧距离)
        this.touch.left = this.$refs.progress.clientWidth // 记录按钮的位置(就是已播放进度条(黄色)的宽度，也就是按钮的偏移位置)
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 记录了手指移动的距离，手指现在的pageX - 手指按下的pageX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)) // 1、条的宽度 - 按钮的宽度 2、(0和 (按钮的位置 + 手指移动的距离)取最大值)   这俩值取最小
        this._offset(offsetWidth)
      },
      progressTouchEnd () {
        this.touch.initiated = false // 说明手指已经抬起
        this._triggerPercent()
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[tranform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 当我们点击progressBtn的时候，e.offsetX获取不对
//        this._offset(e.offsetX)
        this._triggerPercent()
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 宽度最大为： 进度条总宽度 - 按钮的宽度
          const offsetWidth = newPercent * barWidth
          this.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.progressBtn.style[tranform] = `translate3d(${offsetWidth}px,0,0)`
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
