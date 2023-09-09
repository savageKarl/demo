Page({

  /** 页面的初始数据 */
  data: {
    audioOption: {
      iconPath: '',
    },
  },
  /** 生命周期函数--监听页面加载 */
  onLoad() {
    setTimeout(async () => {
      try {
        this.setData({
          ['audioOption.iconPath']: 'http://www.91qc.net.cn/idolphin/images/music.png',
        });
        const audioBox = this.selectComponent('#audio_box');
        await audioBox.switchAudio('https://hwl-1252042487.cos.ap-guangzhou.myqcloud.com/idolphin/question/237df6ba02409ab54ea2e302176c84010d2a2360.mp3');
        await audioBox.play();
      } catch(e) {
        console.error(e);
      }
    }, 0)

  },
  /** 生命周期函数--监听页面显示 */
  onShow() {
  },

  /** 生命周期函数--监听页面隐藏 */
  onHide() {
  },

  /** 生命周期函数--监听页面卸载 */
  onUnload() {
  },

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {

  },

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {

  },

  /** 用户点击右上角分享 */
  onShareAppMessage() {

  },
   
})

export {};
