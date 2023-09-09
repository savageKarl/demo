Page({  
  data: {
    userInfo: {
      name: 'demo',
      age: 10,
      hobby: ['eat', 'play', 'jump'],
    }
  },
  async onLoad() {
    // 在 wxml 使用的变量，赋值需要使用 this.setData 方法
    this.setData({ ['userInfo.name']: 'foo' });

    // 不在 wxml 使用的变量，赋值直接 this.data.xxx 即可
    this.data.userInfo.age = 90;


    
    console.debug(this.data.userInfo);

  },
  async onChooseImage() {
    try {
      const imageRes = await wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });

      const imageInfo = await wx.getImageInfo({ 
        src: imageRes.tempFilePaths[0],
      });

      const canvas = wx.createOffscreenCanvas({type: '2d', width: 300, height: 150})
      // 获取 context。注意这里必须要与创建时的 type 一致
      const context = canvas.getContext('2d')
      
      // 创建一个图片
      const image = canvas.createImage()
      // 等待图片加载
      await new Promise(resolve => {
        image.onload = resolve
        image.src = imageRes.tempFilePaths[0]; // 要加载的图片 url
      })

      // 把图片画到离屏 canvas 上
      context.clearRect(0, 0, 300, 150)
      context.drawImage(image, 0, 0, 300, 150)

      wx.canvasToTempFilePath({
        destWidth: 300,
        destHeight: 150,
        fileType: 'jpg',
        canvas,
        success(res) {
          console.debug(res)
        },
        fail(err) {
          console.error(err);
        }
      })
      // 获取画完后的数据
      const imgData = context.getImageData(0, 0, 300, 150)
      console.debug(imgData)

    } catch (e) {
      console.error(e);
    };
  },
});