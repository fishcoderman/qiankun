import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import TeamPage from './pages/TeamPage';

// 处理 qiankun 环境下的路由前缀
const BASE_NAME = (window as any).__POWERED_BY_QIANKUN__ ? '/about' : '/';

const App: React.FC = () => {
  return (
    <BrowserRouter basename={BASE_NAME}>
      <div className="about-container">
        <h2>About 子应用</h2>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
