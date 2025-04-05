import React, { useState } from 'react';
import { Modal, Input, Button, Space, message } from 'antd';
import { packImages, downloadFiles } from '../utils/imagePacker';

const ExportPreview = ({ images, visible, onClose }) => {
  const [filename, setFilename] = useState('frames');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!filename.trim()) {
      message.error('请输入文件名！');
      return;
    }
    setLoading(true);
    try {
      const { imageBlob, json } = await packImages(images, filename);
      downloadFiles(imageBlob, json, filename);
      message.success('导出成功！');
      onClose();
    } catch (error) {
      message.error('导出失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="导出预览"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <div style={{ marginBottom: 8 }}>文件名（不需要输入扩展名）：</div>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="请输入文件名"
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={handleExport} loading={loading}>
            导出
          </Button>
        </div>
      </Space>
    </Modal>
  );
};

export default ExportPreview; 