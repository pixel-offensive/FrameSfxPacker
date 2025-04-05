import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, Button, message, Card, Space } from 'antd';
import { UploadOutlined, DragOutlined } from '@ant-design/icons';

interface Frame {
  filename: string;
  frame: {
    h: number;
    w: number;
    x: number;
    y: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

interface FrameData {
  frames: Frame[];
  meta: {
    format: string;
    image: string;
    scale: string;
    size: {
      h: number;
      w: number;
    };
    version: string;
  };
}

const DraggableFrame: React.FC<{
  index: number;
  moveFrame: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}> = ({ index, moveFrame, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'frame',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'frame',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveFrame(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: '8px',
      }}
    >
      <Card>
        <Space>
          <DragOutlined />
          {children}
        </Space>
      </Card>
    </div>
  );
};

const FramePacker: React.FC = () => {
  const [frames, setFrames] = useState<File[]>([]);

  const moveFrame = useCallback((dragIndex: number, hoverIndex: number) => {
    setFrames((prevFrames) => {
      const newFrames = [...prevFrames];
      const [removed] = newFrames.splice(dragIndex, 1);
      newFrames.splice(hoverIndex, 0, removed);
      return newFrames;
    });
  }, []);

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件！');
      return false;
    }
    setFrames((prev) => [...prev, file]);
    return false;
  };

  const generateFrameData = async () => {
    if (frames.length === 0) {
      message.error('请先上传图片！');
      return;
    }

    const frameData: FrameData = {
      frames: [],
      meta: {
        format: 'RGBA8888',
        image: 'frames.png',
        scale: '1',
        size: {
          h: 0,
          w: 0,
        },
        version: '1.0',
      },
    };

    // 这里需要实现图片合并和JSON生成的逻辑
    // 由于浏览器限制，实际的图片合并操作需要在后端完成
    message.success('打包功能将在后端实现');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>上传图片</Button>
        </Upload>

        <DndProvider backend={HTML5Backend}>
          {frames.map((frame, index) => (
            <DraggableFrame key={index} index={index} moveFrame={moveFrame}>
              {frame.name}
            </DraggableFrame>
          ))}
        </DndProvider>

        <Button type="primary" onClick={generateFrameData}>
          生成序列帧
        </Button>
      </Space>
    </div>
  );
};

export default FramePacker; 