import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// 处理 qiankun 环境下的路由前缀
const BASE_NAME = (window as any).__POWERED_BY_QIANKUN__ ? '/home' : '/';

const App: React.FC = () => {
  return (
    <BrowserRouter basename={BASE_NAME}>
      <div className="home-container">
        <h2>Home 子应用</h2>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        <div className="home-color">home footer content</div>
      </div>
    </BrowserRouter>
  );
};

export default App;
