import React, { useState, useEffect, useRef } from 'react';
import { Modal, Slider, Button, Space, Switch, Divider } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, RetweetOutlined } from '@ant-design/icons';
import { useConfig } from '../contexts/ConfigContext';

const PreviewPanel = ({ images, visible, onClose }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [fps, setFps] = useState(10);
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
  const { backgroundStyle, backgroundStyles } = useConfig();
  const timerRef = useRef(null);

  const MIN_WIDTH = 800;
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
        setCurrentFrame(prev => {
          const next = prev + 1;
          if (next >= images.length) {
            if (!isLooping) {
              setIsPlaying(false);
              return prev;
            }
            return 0;
          }
          return next;
        });
      }, 1000 / fps);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isPlaying, fps, images.length, isLooping]);

  const handlePlayPause = () => {
    if (!isPlaying && currentFrame === images.length - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleFrameChange = (value) => {
    setCurrentFrame(value);
    setIsPlaying(false);
  };

  const handleFpsChange = (value) => {
    setFps(value);
  };

  const modalWidth = Math.max(Math.min(imageSize.width + 300, 1200), MIN_WIDTH);
  const previewWidth = Math.min(imageSize.width, modalWidth - 200);
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
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: previewWidth,
            height: previewHeight,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...backgroundStyles[backgroundStyle]
          }}>
            {images.length > 0 && (
              <img
                src={images[currentFrame].url}
                alt={`Frame ${currentFrame + 1}`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div style={{ padding: '0 24px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handlePlayPause}
                size="large"
              >
                {isPlaying ? '暂停' : '播放'}
              </Button>
              <Space>
                <RetweetOutlined />
                <Switch
                  checked={isLooping}
                  onChange={setIsLooping}
                  size="default"
                />
                <span>循环播放</span>
              </Space>
            </Space>

            <div style={{ padding: '0 12px' }}>
              <div style={{ marginBottom: 8 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>帧率控制:</span>
                  <span>{fps} FPS</span>
                </Space>
                <Slider
                  min={1}
                  max={60}
                  value={fps}
                  onChange={handleFpsChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>帧数控制:</span>
                  <span>{currentFrame + 1} / {images.length}</span>
                </Space>
                <Slider
                  min={0}
                  max={images.length - 1}
                  value={currentFrame}
                  onChange={handleFrameChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </Space>
        </div>
      </Space>
    </Modal>
  );
};

export default PreviewPanel; 