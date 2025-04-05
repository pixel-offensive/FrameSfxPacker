import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import FramePacker from './components/FramePacker';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <FramePacker />
      </div>
    </ConfigProvider>
  );
}

export default App; 