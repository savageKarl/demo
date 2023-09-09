import fs from 'fs/promises';
import path from 'path';

import axios from 'axios';
import images from 'images';


interface GetImageUrls {
  /** 存放图片url的文件 */
  filePath: string;
}

/** 获取图片url数组列表 */
async function getImageUrls(options: GetImageUrls) {
  const res = await fs.readFile(options.filePath);
  const imageUrlList = res.toString().split(/\r\n/);
  return imageUrlList;
}

interface CompressImageOptions {
  /** 源图片路径  */
  srcFilePath: string;
  /** 压缩后保存的图片路径 */
  distFilePath: string;
  /** 设置图片的短边尺寸 */
  size?: number;
  /** 设置图片的压缩质量 */
  quality?: number;
}

/** 压缩图片尺寸大小和质量 */
function compressImage(options: CompressImageOptions) {
  options.size = options.size ?? 1024;
  options.quality = options.quality ?? 50;



  images(options.srcFilePath)
    .size(options.size)
    .save(options.distFilePath, { quality: options.quality });
}


interface DownloadImageOptions {
  /** 图片url列表 */
  imageUrls: string[];
  /** 设置下载图片的阈值，大于阈值才下载，limit 的单位是 bytes */
  limit: number;
  /** 图片下载后的保存目录 */
  downloadImagePath: string;
  /** 图片压缩后的保存目录 */
  compressImagePath?: string;
}

/** 下载网络图片 */
async function downloadImage(options: DownloadImageOptions) {
  options.limit = options.limit ?? 0;
  
  try {
    await fs.mkdir(path.resolve(__dirname, options.downloadImagePath));
    if (options.compressImagePath) {
      await fs.mkdir(path.resolve(__dirname, options.compressImagePath));
    }
  } catch (e) {
    // 文件夹存在才会报错，所以不用理
  }

  const taskList = options.imageUrls.map(async (url, index) => {
    try {
      const headRes = await axios.head(url);

      if (Number(headRes.headers['content-length']) > options.limit) {
        const fileName = url.split('/').reverse()[0];
        const folderName = url.split('/').reverse()[1];

        const donwloadFileSavePath = path.resolve(
          __dirname,
          options.downloadImagePath,
          folderName,
          fileName,
        );

        const downloadFolderPath = path.resolve(
          __dirname,
          options.downloadImagePath,
          folderName,
        );

        try {
          await fs.access(donwloadFileSavePath);
          console.info(`第${ index + 1 }文件存在，跳过。`);
        } catch (e) {
          console.info(`第${ index + 1 }文件不存在，需要下载！`);
          const res = await axios({ url, responseType: 'arraybuffer' });

          try {
            await fs.access(downloadFolderPath);
            console.info(`${downloadFolderPath} 文件夹目录存在，不需要创建。`);
          } catch (e) {
            console.info(`${downloadFolderPath} 文件夹目录不存在，需要创建！`);
            await fs.mkdir(downloadFolderPath);
          }
          
          try {
            await fs.writeFile(donwloadFileSavePath, res.data as any, 'binary');

            // 传入压缩文件目录参数才开启压缩功能
            if (options.compressImagePath) {
              const compressFileSavePath = path.resolve(
                __dirname,
                options.compressImagePath,
                folderName,
                fileName,
              );

              const compressFolderPath = path.resolve(
                __dirname,
                options.compressImagePath,
                folderName,
              );
              
              try {
                await fs.access(compressFolderPath);
                console.info(`${compressFolderPath} 文件夹目录存在，不需要创建。`);
              } catch (e) {
                await fs.mkdir(compressFolderPath);
                console.info(`${compressFolderPath} 文件夹目录不存在，需要创建！`);
              };

              compressImage({
                srcFilePath: donwloadFileSavePath,
                distFilePath: compressFileSavePath,
              });
            };
          } catch (e) {
            console.error(e);
          };
        };
      }
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.all(taskList);
  console.info('处理完成！！！');
}

(async function() {
  const imageUrls = await getImageUrls({
    filePath: path.resolve(__dirname, 'promoter1018-1025.txt')
  });
  downloadImage({
    imageUrls: imageUrls.slice(0, 50),
    downloadImagePath: 'downloadedImagesSavePath',
    // compressImagePath: 'compressedImagesSavePath',
    limit: 0,
  })
})();
