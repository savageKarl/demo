interface Options {
  iconPath: string; // 音频图标
  loop?: boolean; // 默认为true
}

function debounce(fn: Function, delay = 1000, fristTrigger = true) {
  let timer: any = null;
  return function () {
    if (timer) clearTimeout(timer);
    if (fristTrigger) {
      if (!timer) {
        fn.apply((this), arguments)
      };
      timer = setTimeout(() => timer = null, delay);
    } else {
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    }
  }
}

Component({
  /** 组件的属性列表 */
  properties: {
    options: {
      type: Object,
    },
  },
  /** 组件的初始数据 */
  data: {
    audioCtx: {} as WechatMiniprogram.InnerAudioContext,
    audioStatus: 'pausing', // 音频状态，只有 playing 和 pausing
  },
  /** 组件的方法列表 */
  methods: {
    click: debounce(function(){
      if (this.data.audioStatus === 'playing') {
        this.pause();
      } else {
        this.play();
      }
    }),
    /** 播放音频 */
    play() {
      return new Promise<void>((resolve, reject) => {
        this.data.audioCtx.offPlay();
        this.data.audioCtx.offError();
        this.data.audioCtx.play();
        this.data.audioCtx.onPlay(() => {
          this.setData({ audioStatus: 'playing' });
          resolve();
        });
        this.data.audioCtx.onError(() => {
          reject('播放错误');
        });
      });
    },
    /** 暂停播放音频 */
    pause() {
      return new Promise<void>((resolve, reject) => {
        this.data.audioCtx.offPause();
        this.data.audioCtx.offError();
        this.data.audioCtx.pause();
        this.data.audioCtx.onPause(() => {
          this.setData({ audioStatus: 'pausing' });
          resolve();
        });
        this.data.audioCtx.onError(() => {
          reject('暂停错误');
        });
      });
    },
    /** 停止播放音频 */
    stop() {
      return new Promise<void>((resolve, reject) => {
        this.data.audioCtx.offStop();
        // 只有播放的时候，停止才有效，否则不起作用
        this.data.audioCtx.stop();
        this.data.audioCtx.onStop(() => {
          resolve();
        });
      })
    },
    /** 切换音频 */
    switchAudio: debounce(function(src: string) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (this.data.audioStatus === 'playing') {
            await this.stop();
            this.data.audioCtx.src = src;
            await this.play();
            resolve();
          } else {
            this.data.audioCtx.src = src;
            resolve();
          }
        } catch(e) {
          console.error(e);
        }
      });
    }),
  },
  lifetimes: {
    /** 在组件实例进入页面节点树时执行 */
    attached: function() {
      this.setData({ audioCtx: wx.createInnerAudioContext() }, () => {
        const _audioCtx = this.data.audioCtx;
        const _options = this.properties.options as Options;
        _audioCtx.onError(() => {
          console.error('音频播放错误');
        });
        _audioCtx.loop = _options.loop ?? true;
      });
    },
    /** 在组件实例被从页面节点树移除时执行 */
    detached: function() {
      this.data.audioCtx.destroy();
    },
  },
  pageLifetimes: {
    /** 页面被展示 */ 
    show: function() {
      if (this.data.audioCtx.src) this.play();
    },
    /** 页面被展示 */
    hide: function() {
      this.pause();
    },
  },
});
