import * as functions from '../../utils/functions';

Component({
  /** 组件的属性列表，由父组件传入 */
  properties: {
    /** 音频资源 */
    audioSrc: {
      type: String
    },
    /** 音频图标 */
    iconPath: {
      type: String,
    },
    /** 图标定位 */
    left: {
      type: Number,
      value: 0,
    },
    /** 图标定位 */
    bottom: {
      type: Number,
      value: 0,
    },
    /** 图标宽度 */
    iconWidth: {
      type: Number,
      value: 60,
    },
    /** 图标高度 */
    iconHeight: {
      type: Number,
      value: 60,
    },
    /** 是否循环播放，默认为true */
    loop: {
      type: Boolean,
      value: true,
    },
    /** 否自动播放，默认为true */
    autoplay: {
      type: Boolean,
      value: true,
    },
  },
  /** 组件的内部数据 */
  data: {
    /** 音频图标的样式 */
    style: '',
    /** 音频状态，只有 playing 和 pausing */
    audioStatus: 'pausing' as ('playing' | 'pausing'),

    audioCtx: {} as WechatMiniprogram.InnerAudioContext,
    /** 判断是否首次播放，用来控制首次自动播放 */
    firstPlay: true,
  },
  lifetimes: {
    /** 组件生命周期--在组件实例进入页面节点树时执行 */
    attached() {
      this.data.audioCtx = wx.createInnerAudioContext();
      this.data.audioCtx.onError(() => console.error('音频播放错误'));
      this.data.audioCtx.loop = this.properties.loop;

      this.setData({ 
        style: `left: ${ this.properties.left  }rpx; `
          + `bottom: ${ this.properties.bottom  }rpx; `
          + `width: ${ this.properties.iconWidth  }rpx; `
          + `height: ${ this.properties.iconHeight  }rpx; `,
        });
    },
    /** 组件生命周期--在组件实例被从页面节点树移除时执行 */
    detached() {
      this.data.audioCtx.destroy();
    }
  },
  pageLifetimes: {
    /** 生命周期函数--页面被展示 */
    show: function () {
      if (this.data.audioCtx.src) this.play();
    },
    /** 生命周期函数--页面被隐藏 */
    hide: function () {
      this.pause();
    },
  },
  /** 组件的方法列表 */
  methods: {
    /** 事件处理器--点击音频图标 */
    onClick: functions.debounce(function (this: any) {
      if (this.data.audioStatus === 'playing') {
        this.pause();
      } else {
        this.play();
      }
    }),
    /** 播放音频 */
    play() {
      this.data.audioCtx.offPlay();
      this.data.audioCtx.play();
      this.data.audioCtx.onPlay(() => {
        this.setData({ audioStatus: 'playing' })
      });
    },
    /** 暂停播放音频 */
    pause() {
      this.data.audioCtx.offPause();
      this.data.audioCtx.pause();
      this.data.audioCtx.onPause(() => {
        this.setData({ audioStatus: 'pausing' })
      });
    },
    /** 停止播放音频 */
    stop() {
      this.data.audioCtx.offStop();
      // 只有播放的时候，停止才有效，否则不起作用
      this.data.audioCtx.stop();
    },
    /** 切换音频 */
    switchAudio(src: string) {
      if (this.data.audioStatus === 'playing') {
        this.stop();
        this.data.audioCtx.src = src;
        this.play();
      } else {
        this.data.audioCtx.src = src;
      };
    },
  },
});
