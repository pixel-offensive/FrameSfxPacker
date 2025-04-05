"use client"
import {Button, message, Upload, Select, Space, Alert, Layout} from "antd";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ProCard} from "@ant-design/pro-components";
import {EyeOutlined, FolderOpenOutlined, UploadOutlined, GithubOutlined} from "@ant-design/icons";
import DraggableImageList from "@/components/DraggableImageList";
import PreviewPanel from "@/components/PreviewPanel";
import ExportPreview from "@/components/ExportPreview";
import {useState} from "react";
import { ConfigProvider, useConfig } from "@/contexts/ConfigContext";


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

const AppContent = () => {
    const [images, setImages] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [exportVisible, setExportVisible] = useState(false);
    const { backgroundStyle, setBackgroundStyle } = useConfig();

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

    const handleDeleteImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleExport = () => {
        setExportVisible(true);
    };

    return (
        <Layout>
            <Layout.Content className="app-container">
                <ProCard title="Minecraft 序列帧打包工具" bordered>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Alert
                            message="使用说明"
                            description={
                                <ul style={{margin: 0, paddingLeft: '20px'}}>
                                    <li>上传图片：点击"上传图片"按钮选择单张图片，或点击"选择文件夹"按钮批量上传整个文件夹的图片</li>
                                    <li>预览背景：使用右上角的下拉菜单选择预览背景样式（棋盘格/白色/黑色/灰色）</li>
                                    <li>调整顺序：通过拖拽来调整图片顺序，确保序列帧的正确播放顺序</li>
                                    <li>预览动画：点击"预览动画"按钮查看序列帧动画效果
                                        <ul>
                                            <li>可调整帧率（1-60 FPS）</li>
                                            <li>可开启/关闭循环播放</li>
                                            <li>可通过滑块控制当前帧</li>
                                        </ul>
                                    </li>
                                    <li>删除图片：点击图片右侧的删除按钮移除不需要的图片</li>
                                    <li>导出文件：点击"导出序列帧"按钮，输入文件名后导出合并的图片和JSON文件</li>
                                </ul>
                            }
                            type="info"
                            showIcon
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Select
                                value={backgroundStyle}
                                onChange={setBackgroundStyle}
                                style={{ width: 200 }}
                            >
                                <Select.Option value="checkerboard">棋盘格背景</Select.Option>
                                <Select.Option value="white">白色背景</Select.Option>
                                <Select.Option value="black">黑色背景</Select.Option>
                                <Select.Option value="gray">灰色背景</Select.Option>
                            </Select>
                        </div>
                        <div className="upload-section">
                            <Upload
                                beforeUpload={handleUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined/>}>上传图片</Button>
                            </Upload>
                            <input
                                type="file"
                                id="folder-upload"
                                webkitdirectory=""
                                directory=""
                                multiple
                                onChange={handleFileSelect}
                                style={{display: 'none'}}
                            />
                            <Button
                                icon={<FolderOpenOutlined/>}
                                onClick={() => document.getElementById('folder-upload').click()}
                            >
                                选择文件夹
                            </Button>
                            <Button
                                icon={<EyeOutlined/>}
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
                            onDeleteImage={handleDeleteImage}
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
                    </Space>
                </ProCard>
            </Layout.Content>
            <Layout.Footer style={{ 
                textAlign: 'center',
                background: 'transparent',
                marginTop: '24px',
                width: '100%'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>Made with ❤️ by&nbsp;<a href="https://github.com/pixel-offensive" target="_blank">PixelOffensive</a></span>
                    <span>|</span>
                    <a 
                        href="https://github.com/pixel-offensive/FrameSfxPacker" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <GithubOutlined />
                        GitHub
                    </a>
                </div>
            </Layout.Footer>
        </Layout>
    );
};

const App = () => {
    return (
        <ConfigProvider>
            <DndProvider backend={HTML5Backend}>
                <AppContent />
            </DndProvider>
        </ConfigProvider>
    );
};

export default function Home() {
    return <App/>;
}
