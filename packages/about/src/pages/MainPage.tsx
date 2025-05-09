import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div>
      <h3>关于我们</h3>
      <p>这是 About 子应用的主页面，介绍我们的公司信息</p>
      <Link to="/team">查看团队信息</Link>
    </div>
  );
};

export default MainPage;
