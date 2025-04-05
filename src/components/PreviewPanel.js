import React, { useState, useEffect, useRef } from 'react';
import { Modal, Slider, Button, Space } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const PreviewPanel = ({ images, visible, onClose }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(10);
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
  const timerRef = useRef(null);

  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 100;

  useEffect(() => {
    if (images.length > 0) {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
      };
      img.src = images[0].url;
    }
  }, [images]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % images.length);
      }, 1000 / fps);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isPlaying, fps, images.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameChange = (value) => {
    setCurrentFrame(value);
    setIsPlaying(false);
  };

  const handleFpsChange = (value) => {
    setFps(value);
  };

  const modalWidth = Math.max(Math.min(imageSize.width + 100, 800), MIN_WIDTH);
  const previewWidth = Math.min(imageSize.width, modalWidth - 100);
  const previewHeight = (previewWidth / imageSize.width) * imageSize.height;

  return (
    <Modal
      title="序列帧预览"
      open={visible}
      onCancel={onClose}
      width={modalWidth}
      footer={null}
      bodyStyle={{
        minHeight: MIN_HEIGHT + 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          width: previewWidth,
          height: previewHeight,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}>
          {images.length > 0 && (
            <img
              src={images[currentFrame].url}
              alt={`Frame ${currentFrame + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          )}
        </div>
        <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={handlePlayPause}
            >
              {isPlaying ? '暂停' : '播放'}
            </Button>
            <span>帧率: {fps} FPS</span>
          </div>
          <Slider
            min={1}
            max={30}
            value={fps}
            onChange={handleFpsChange}
            style={{ width: '100%' }}
          />
          <Slider
            min={0}
            max={images.length - 1}
            value={currentFrame}
            onChange={handleFrameChange}
            style={{ width: '100%' }}
          />
          <div>
            当前帧: {currentFrame + 1} / {images.length}
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default PreviewPanel; 