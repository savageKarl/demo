// pages/play_audio/play_audio.ts
Page({

  /** 页面的初始数据 */
  data: {
    audioOption: {
      iconPath: '',
    },
  },
  /** 生命周期函数--监听页面加载 */
  onLoad() {
    this.setData({
      ['audioOption.iconPath']: 'http://www.91qc.net.cn/idolphin/images/music.png',
    });
    const audioBox = this.selectComponent('#audio_box');
    audioBox.switchAudio('https://hwl-1252042487.cos.ap-guangzhou.myqcloud.com/idolphin/question/e2f7295d0928eadc3fa8a716a9f46b39d68dd87d.mp4');
    audioBox.play();
  },
  /** 生命周期函数--监听页面显示 */
  onShow() {
    console.debug('onshow2')

  },

  /** 生命周期函数--监听页面隐藏 */
  onHide() {
    // this.data.audioCtx.destroy();
  },

  /** 生命周期函数--监听页面卸载 */
  onUnload() {
    // this.data.audioCtx.destroy();
  },

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {

  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {

  },

  /** 用户点击右上角分享 */
  onShareAppMessage() {

  }
})

export {};