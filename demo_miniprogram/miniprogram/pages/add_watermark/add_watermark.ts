// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
import {formatTime} from '../../utils/util'

Page({
  data: {
    version: 1.15,
    imageSrc: '',
    canvasImageSrc: '',
    imagePath: '',
  },
  
  async chooseImage() {
    try {
      const imageRes = await wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });
      const tempFilePath = imageRes.tempFilePaths[0];
      this.setData({
        imagePath: tempFilePath,
        color: '#fff',
        text: formatTime(new Date()),
      });
      wx.showLoading({
        title: '图片处理中',
      })
      // const watermarkResult: any = await this.selectComponent('#watermark');
      // console.debug(watermarkResult);
      // this.setData({ canvasImageSrc: watermarkResult.path });
      // await wx.saveImageToPhotosAlbum({ filePath: watermarkResult.path })
      console.debug('我保存了')
    } catch (err) {
      console.debug(err)
    }
  },
  onComplete(e: { detail: string }) {
    wx.hideLoading();
    wx.showToast({ title: '处理完毕'});
    console.debug(e.detail);
    wx.saveImageToPhotosAlbum({ filePath: e.detail });
  },
  previewImage(e: any) {
    const img = e.currentTarget.dataset.src;
    wx.previewImage({ current: img, urls: [img] });
  }
})
