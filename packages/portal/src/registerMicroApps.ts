import { registerMicroApps, start } from '@micro/qiankun';
// import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'home',
    entry: '//localhost:8001',
    container: '#subapp-container',
    activeRule: '/home',
  },
  {
    name: 'about',
    entry: '//localhost:8002',
    container: '#subapp-container',
    activeRule: '/about',
  },
]);

// 启动 qiankun
start();
