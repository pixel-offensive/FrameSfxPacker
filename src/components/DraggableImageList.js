import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Image, List, Button } from 'antd';
import { DragOutlined, DeleteOutlined } from '@ant-design/icons';
import { useConfig } from '../contexts/ConfigContext';

const DraggableImageItem = ({ image, index, moveImage, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  const { backgroundStyle, backgroundStyles } = useConfig();

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '8px',
        border: '1px dashed #d9d9d9',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      }}
    >
      <DragOutlined style={{ marginRight: '8px' }} />
      <div style={{ 
        width: 100, 
        height: 100, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...backgroundStyles[backgroundStyle]
      }}>
        <Image
          src={image.url}
          alt={image.name}
          width={100}
          height={100}
          style={{ objectFit: 'contain' }}
          preview={false}
        />
      </div>
      <span style={{ marginLeft: '8px', flex: 1 }}>{image.name}</span>
      <Button 
        type="text" 
        icon={<DeleteOutlined />} 
        danger
        onClick={() => onDelete(index)}
        style={{ marginLeft: '8px' }}
      />
    </div>
  );
};

const DraggableImageList = ({ images, onMoveImage, onDeleteImage }) => {
  return (
    <List
      dataSource={images}
      renderItem={(image, index) => (
        <DraggableImageItem
          key={image.id}
          image={image}
          index={index}
          moveImage={onMoveImage}
          onDelete={onDeleteImage}
        />
      )}
    />
  );
};

export default DraggableImageList; 