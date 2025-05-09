import React from 'react';
import { Link } from 'react-router-dom';

const TeamPage: React.FC = () => {
  return (
    <div>
      <h3>团队信息</h3>
      <p>这是 About 子应用的团队页面，展示团队成员信息</p>
      <Link to="/">返回关于我们</Link>
    </div>
  );
};

export default TeamPage;
