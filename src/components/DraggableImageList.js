import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Image, List } from 'antd';
import { DragOutlined } from '@ant-design/icons';

const DraggableImageItem = ({ image, index, moveImage }) => {
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
        backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
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
      <span style={{ marginLeft: '8px' }}>{image.name}</span>
    </div>
  );
};

const DraggableImageList = ({ images, onMoveImage }) => {
  return (
    <List
      dataSource={images}
      renderItem={(image, index) => (
        <DraggableImageItem
          key={image.id}
          image={image}
          index={index}
          moveImage={onMoveImage}
        />
      )}
    />
  );
};

export default DraggableImageList; 