import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Portal 应用</h1>
          <nav>
            <ul>
              <li><Link to="/">主页</Link></li>
              <li><Link to="/home">Home 子应用</Link></li>
              <li><Link to="/about">About 子应用</Link></li>
            </ul>
          </nav>
        </header>
        <main id="subapp-container">
          <Routes>
            <Route path="/" element={<div className="main-content">欢迎来到主应用</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
