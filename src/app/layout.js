import "./globals.css";


export const metadata = {
    title: "序列帧打包工具",
    description: "一个简单易用的序列帧打包工具，支持图片拖拽排序、动画预览和一键导出。适用于制作 Minecraft 中国版中的序列帧动画。",
};

export default function RootLayout({children}) {
    return (
        <html lang="zh">
        <body>
        {children}
        </body>
        </html>
    );
}
