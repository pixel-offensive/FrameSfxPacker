export const packImages = async (images, filename) => {
  // 创建画布
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 计算总宽度和最大高度
  let totalWidth = 0;
  let maxHeight = 0;
  const imagePromises = images.map(img => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        totalWidth += image.width;
        maxHeight = Math.max(maxHeight, image.height);
        resolve({ image, width: image.width, height: image.height });
      };
      image.src = img.url;
    });
  });

  const loadedImages = await Promise.all(imagePromises);

  // 设置画布大小
  canvas.width = totalWidth;
  canvas.height = maxHeight;

  // 绘制所有图片
  let x = 0;
  const frames = loadedImages.map(({ image, width, height }, index) => {
    ctx.drawImage(image, x, 0);
    const frame = {
      filename: images[index].name,
      frame: {
        h: height,
        w: width,
        x: x,
        y: 0
      },
      scale: {
        x: 1.0,
        y: 1.0,
        z: 1.0
      }
    };
    x += width;
    return frame;
  });

  // 生成JSON
  const json = {
    frames: frames,
    meta: {
      format: "RGBA8888",
      image: `${filename}.png`,
      scale: "1",
      size: {
        h: maxHeight,
        w: totalWidth
      },
      version: "1.0"
    }
  };

  // 导出图片
  const imageBlob = await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });

  return {
    imageBlob,
    json
  };
};

export const downloadFiles = (imageBlob, json, filename) => {
  // 下载图片
  const imageUrl = URL.createObjectURL(imageBlob);
  const imageLink = document.createElement('a');
  imageLink.href = imageUrl;
  imageLink.download = `${filename}.png`;
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
  URL.revokeObjectURL(imageUrl);

  // 下载JSON
  const jsonBlob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement('a');
  jsonLink.href = jsonUrl;
  jsonLink.download = `${filename}.json`;
  document.body.appendChild(jsonLink);
  jsonLink.click();
  document.body.removeChild(jsonLink);
  URL.revokeObjectURL(jsonUrl);
}; 