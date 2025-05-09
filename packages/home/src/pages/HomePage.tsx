import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <h3>Home 页面</h3>
      <p>这是 Home 子应用的主页面</p>
      <Link to="/about">前往 About 页面</Link>
    </div>
  );
};

export default HomePage;
