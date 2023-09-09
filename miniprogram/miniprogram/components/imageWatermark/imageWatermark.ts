Component({
    /** 组件的属性列表 */
    properties: {
      /** 需要处理的图片路径 */
      imagePath: { 
        type: String,
        observer(newVal, oldVal) {
          this.addWatermark(newVal);
        },
      },
      /** 水印颜色 */
      color: {
        type: String,
        value: '#fff',
      },
      /** 水印内容 */
      text: { // 
        type: String,
        value: new Date().toJSON(),
      },
      /** 限制图片压缩的大小，单位是bytes */
      size: {
        type: Number,
        value: 300 * 1024,
      },
      /** 钩子函数——添加水印前 */
      addWatermarkBefore: {
        type: Object,
      },
      /** 钩子函数——添加水印成功后 */
      addWatermarkSuccess: {
        type: Object,
      },
      /** 钩子函数——添加水印失败后 */
      addWatermarkFail: {
        type: Object,
      },
      /** 钩子函数——压缩图片之前 */
      compressBefore: {
        type: Object,
      },
      /** 钩子函数——压缩图片成功后 */
      compressSuccess: {
        type: Object,
      },
      /** 钩子函数——压缩图片失败后 */
      compressFail: {
        type: Object,
      },
    },
    /** 组件的初始数据 */
    data: {
      canvas: {} as WechatMiniprogram.Canvas,
      context: {} as any,
    },

    lifetimes: {
      attached() {
        this.initCanvas();
      },
    },
    /** 组件的方法列表 */
    methods: {
      /** 初始化 Canvas */
      initCanvas() {
        const query = this.createSelectorQuery();
        query.select('#myCanvas')
          .fields({ node: true, size: true })
          .exec(async (res) => {
            this.data.canvas = res[0].node;
            this.data.context = this.data.canvas.getContext('2d');
          });
      },
      /** 图片添加水印 */
      async addWatermark(imgPath: string) {
        try {
         (this.properties.addWatermarkBefore as Function)?.();
          const originImageInfo = await wx.getImageInfo({ src: imgPath });
          // 小程序2d画布最大为1365，超过可能会出现bug
          const size = 1365;
          const { width: imgWidth, height: imgHeight } = originImageInfo;
          let canvasWidth = imgWidth;
          let canvasHeight = imgHeight;
          const longSide = Math.max(imgWidth, imgHeight);
          // 将长边限制为1365
          // 放大是乘法，缩小是除法
          if (longSide === imgWidth && longSide > size) {
            canvasWidth = size;
            canvasHeight = imgHeight / (imgWidth / size);
          }; 
          if(longSide === imgHeight && longSide > size) {
            canvasHeight = size;
            canvasWidth = imgWidth / (imgHeight / size);
          };
          this.data.canvas.width = canvasWidth;
          this.data.canvas.height = canvasHeight;

          const image = this.data.canvas.createImage();
          await new Promise((resolve, reject) => {
            image.src = imgPath;
            image.onload = resolve;
            image.onerror = reject;
          });
          const ctx = this.data.context;
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          ctx.font = `${canvasHeight / 55}px sans-serif`;
          ctx.fillStyle = this.properties.color;
          ctx.shadowColor = "#333"; // 阴影颜色
          ctx.shadowOffsetX = 0; // 阴影x轴位移。正值向右，负值向左。
          ctx.shadowOffsetY = 0; // 阴影y轴位移。正值向下，负值向上。
          ctx.shadowBlur = 5; // 阴影模糊滤镜。数据越大，扩散程度越大。
          ctx.fillText(this.properties.text, 20, canvasHeight -20);
          wx.canvasToTempFilePath({
            destWidth: canvasWidth,
            destHeight: canvasHeight,
            canvas: this.data.canvas,
            fileType: 'jpg',
            success: async (res) => {
              (this.properties.addWatermarkSuccess as Function)?.();
              const minifiedImage = await wx.compressImage({ src: res.tempFilePath, quality: 80 });
              console.debug(minifiedImage.tempFilePath);
              
              this.triggerEvent('complete', res.tempFilePath);
            },
            fail: async (err) => {
              console.error(err);
              (this.properties.addWatermarkFail as Function)?.();
            }
          });
        } catch (e) {
          console.error(e);
          (this.properties.addWatermarkFail as Function)?.();
        };
      },
    },
});
