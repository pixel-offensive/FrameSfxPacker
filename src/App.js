import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, FolderOpenOutlined, EyeOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import DraggableImageList from './components/DraggableImageList';
import PreviewPanel from './components/PreviewPanel';
import ExportPreview from './components/ExportPreview';
import './App.css';

const extractNumber = (filename) => {
  const match = filename.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const sortImages = (images) => {
  return [...images].sort((a, b) => {
    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);
    return numA - numB;
  });
};

const App = () => {
  const [images, setImages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      message.error('所选文件夹中没有图片文件！');
      return;
    }

    const newImages = await Promise.all(
      imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              file,
              url: e.target.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const sortedImages = sortImages(newImages);
    setImages(prev => sortImages([...prev, ...sortedImages]));
  };

  const handleUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage = {
        id: Date.now(),
        file,
        url: e.target.result,
        name: file.name
      };
      setImages(prev => sortImages([...prev, newImage]));
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleMoveImage = (dragIndex, hoverIndex) => {
    const dragImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, dragImage);
    setImages(newImages);
  };

  const handleExport = () => {
    setExportVisible(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <ProCard title="Minecraft 序列帧打包工具" bordered>
          <div className="upload-section">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
            <input
              type="file"
              id="folder-upload"
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              icon={<FolderOpenOutlined />}
              onClick={() => document.getElementById('folder-upload').click()}
            >
              选择文件夹
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
              disabled={images.length === 0}
            >
              预览动画
            </Button>
            <Button
              type="primary"
              onClick={handleExport}
              disabled={images.length === 0}
            >
              导出序列帧
            </Button>
          </div>
          <DraggableImageList
            images={images}
            onMoveImage={handleMoveImage}
          />
          <PreviewPanel
            images={images}
            visible={previewVisible}
            onClose={() => setPreviewVisible(false)}
          />
          <ExportPreview
            images={images}
            visible={exportVisible}
            onClose={() => setExportVisible(false)}
          />
        </ProCard>
      </div>
    </DndProvider>
  );
};

export default App;
