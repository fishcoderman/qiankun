import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div>
      <h3>About 页面</h3>
      <p>这是 Home 子应用的 About 页面</p>
      <Link to="/">返回 Home 页面</Link>
    </div>
  );
};

export default AboutPage;
