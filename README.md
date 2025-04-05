# Minecraft 序列帧打包工具

一个用于 Minecraft 的序列帧打包工具，可以将多个图片合并成一个序列帧图片，并生成对应的 JSON 配置文件。

## 功能特点

- 🖼️ 支持单张图片上传和文件夹批量上传
- 🔄 自动按文件名中的数字排序
- 🎮 支持拖拽调整图片顺序
- 👀 实时预览动画效果
- ⚙️ 可调整动画播放速度
- 📦 导出序列帧图片和配置文件
- 🎨 支持透明背景图片

## 在线体验

访问 [GitHub Pages](https://yourusername.github.io/frame-sfx-packer) 在线体验

## 本地开发

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

1. 上传图片
   - 点击"上传图片"按钮选择单张图片
   - 点击"选择文件夹"按钮批量上传图片

2. 调整顺序
   - 拖拽图片可以调整顺序
   - 图片会自动按文件名中的数字排序

3. 预览动画
   - 点击"预览动画"按钮查看效果
   - 可以调整播放速度
   - 可以手动选择特定帧

4. 导出文件
   - 点击"导出序列帧"按钮
   - 输入文件名（不需要扩展名）
   - 系统会自动生成同名的 PNG 和 JSON 文件

## 导出文件说明

### PNG 文件
- 所有图片会水平排列
- 保持原始图片的尺寸
- 支持透明背景

### JSON 文件
```json
{
  "frames": [
    {
      "filename": "00.png",
      "frame": {
        "h": 1,
        "w": 1,
        "x": 0,
        "y": 0
      },
      "scale": {
        "x": 1.0,
        "y": 1.0,
        "z": 1.0
      }
    }
  ],
  "meta": {
    "format": "RGBA8888",
    "image": "frames.png",
    "scale": "1",
    "size": {
      "h": 1,
      "w": 6
    },
    "version": "1.0"
  }
}
```

## 技术栈

- React
- Ant Design
- Ant Design Pro Components
- React DnD (拖拽功能)
- HTML5 Canvas (图片处理)

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至 [您的邮箱]

## 致谢

感谢所有为本项目做出贡献的开发者！
