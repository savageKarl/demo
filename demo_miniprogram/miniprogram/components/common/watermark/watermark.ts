// 需要传给组件的数据结构
interface Options {
  imagePath: string; // 需要处理的图片路径
  color: string; // 水印颜色
  text: string; // 水印内容
  compressLimit: number; // 限制图片压缩的大小
  compressSize: number; // 限制图片压缩的图片短边尺寸
  quality: number; // 控制图片压缩的质量
  addWatermarkBefore: () => Promise<unknown>;
  addWatermarkSuccess: () => Promise<unknown>;
  addWatermarkFail: () => Promise<unknown>;
  compressBefore: () => Promise<unknown>;
  compressSuccess: () => Promise<unknown>;
  compressFail: () => Promise<unknown>;
}

interface ResultData {
  path: string; // 临时图片路径
  size?: number; // 图片大小
  status?: boolean; // 图片是否加水印压缩成功， 加水印和压缩成功为true，否则都是false
  width?: number; // 图片宽度
  height?: number; // 图片高度
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Object,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    myCanvas: {} as any,
    myCtx: {} as any,
    result: new Promise<ResultData>(() => { }), // 自定义的组件实例获取结果
  },
  lifetimes: {
    attached: function () {
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
          const myCanvas = res[0].node;
          const myCtx = myCanvas.getContext('2d');
          this.setData({ myCanvas, myCtx, });
        });
    },
    /** 图片添加水印 */
    async addWatermark(imgPath: string) {
      const originImageInfo = await wx.getImageInfo({ src: imgPath });
      const canvas = this.data.myCanvas;
      const ctx = this.data.myCtx;
      // canvas.width = originImageInfo.width;
      // canvas.height = originImageInfo.height;
      canvas.width = 1365;
      canvas.height = 1365;
      const _options = this.properties.options as Options;
      _options.addWatermarkBefore?.();
      return new Promise<ResultData>(async (resolve) => {
        const image = canvas.createImage();
        image.src = imgPath;
        image.onload = () => {
          ctx.drawImage(image, 0, 0, originImageInfo.width, originImageInfo.height);
          ctx.font = `${ originImageInfo.height / 55 }px sans-serif`;
          ctx.fillStyle = _options.color;
          ctx.fillText(_options.text, 20, originImageInfo.height - 20);
          wx.canvasToTempFilePath({
            destWidth: originImageInfo.width,
            destHeight: originImageInfo.height,
            canvas: canvas,
            fileType: 'jpg',
            success: async (res) => {
              _options.addWatermarkSuccess?.();
              resolve(this.compress(res.tempFilePath, _options.compressSize, _options.quality, _options.compressLimit));
            },
            fail: async (error) => {
              _options.addWatermarkFail?.();
              await wx.showToast({ title: '图片加水印失败！',  icon: 'none', duration: 2000, });
              console.error('图片加水印失败', error);
              // 即使加水印失败，也要返回原来没处理的图片
              resolve({path: _options.imagePath, status: false});
            }
          }, this);
        };
        image.onerror = (e: any) => {
          _options.addWatermarkFail?.();
          console.error('创建图片错误', e);
          return { path: _options.imagePath, status: false };
        };
      });
    },
    /** 压缩图片大小, size: 短边尺寸，quality：图片压缩质量, limit：限制图片的大小 */
    async compress(imgPath: string, size = 768, quality = 0, limit = 300 * 1024) {
      const _options = this.properties.options as Options;
      _options.compressBefore?.();
      try {
        const minifiedImage = await wx.compressImage({ src: imgPath, quality });
        const [minifiedImageInfo, minifiedFileInfo] = await Promise.all([
          wx.getImageInfo({ src: minifiedImage.tempFilePath }),
          wx.getFileInfo({ filePath: minifiedImage.tempFilePath })
        ]);
        if (minifiedFileInfo.size < limit) {
          const res: ResultData = {
            path: minifiedImage.tempFilePath,
            status: true,
            size: minifiedFileInfo.size,
            width: minifiedImageInfo.width,
            height: minifiedImageInfo.height,
          };
          return res;
        };
        const { width: imgWidth, height: imgHeight } = minifiedImageInfo;
        return new Promise<ResultData>(async (resolve) => {
          const canvas = this.data.myCanvas;
          const ctx = this.data.myCtx;
          canvas.width = imgWidth;
          canvas.height = imgHeight;
          let targetWidth = 0, targetHeight = 0;
          // 优先压缩短边+*
          const shortSide = Math.min(imgWidth, imgHeight);
          // 放大是乘法，缩小是除法
          if (shortSide === imgWidth && shortSide > size) {
            targetWidth = size;
            targetHeight = imgHeight / (imgWidth / size);
          } else if (shortSide === imgHeight && shortSide > size) {
            targetHeight = size;
            targetWidth = imgWidth / (imgHeight / size);
          }
          const image = canvas.createImage();
          image.src = imgPath;
          image.onload = () => {
            ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
            wx.canvasToTempFilePath({
              destWidth: targetWidth,
              destHeight: targetHeight,
              canvas: canvas,
              fileType: 'jpg',
              success: async (res) => {
                _options.compressSuccess?.();
                resolve(this.compress(res.tempFilePath, size, quality, limit));
              },
              fail: async (error) => {
                _options.compressFail?.();
                console.error('图片压缩失败', error);
                // 即使图片压缩失败，也要返回原图片
                resolve({ path: _options.imagePath, status: false });
              }
            }, this);
          }
          image.onerror = (e: any) => {
            _options.compressFail?.();
            console.error('创建图片错误', e);
            resolve({ path: _options.imagePath, status: false });
          };
        });
      } catch (e) {
        _options.compressFail?.();
        console.error(e);
        return { path: _options.imagePath, status: false };
      }
    },
  },
  observers: {
    options: async function (options: Options) {
      // 因为父组件传入初始化的值，会导致下面出bug，所以必须判断
      if (!options.imagePath) return;
      this.setData({
        result: new Promise(async (resolve, reject) => {
          try {
            wx.showLoading({ title: '正在处理图片...', });
            this.setData({ originalPicture: options.imagePath });
            const timeStart = Date.now();
            const watermarkResult = await this.addWatermark((this.properties.options as Options).imagePath);
            const timeEnd = Date.now();
            wx.hideLoading();
            wx.showModal({ title: `图片加水印耗时 ${(timeEnd - timeStart) / 1000} 秒。`, showCancel: false });
            resolve(watermarkResult);
          } catch (err) {
            console.error(err);
            wx.hideLoading();
            reject(err);
          }
        })
      });
    }
  },
  /** 自定义的组件实例获取结果 */
  behaviors: ['wx://component-export'],
  export() {
    return this.data.result;
  }
});

export{}