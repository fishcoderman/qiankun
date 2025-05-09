// 微应用主入口

import { loadApp, unloadApp } from './loader.js';
import { setGlobalState, getGlobalState, onGlobalStateChange, initGlobalState } from './communication.js';

// 导出通信API
export { setGlobalState, getGlobalState, onGlobalStateChange, initGlobalState };

// 存储已注册的微应用
const microApps = [];

// 当前激活的微应用
let activeApp = null;
// 当前激活应用的生命周期
let activeAppLifecycle = null;

/**
 * 注册微应用
 * @param {Array} apps - 微应用配置数组
 */
export function registerMicroApps(apps) {
  microApps.push(...apps);
  console.log('已注册微应用:', microApps);
}

/**
 * 加载微应用
 * @param {Object} app - 微应用配置
 */
async function loadMicroApp(app) {
  console.log(`加载微应用: ${app.name}`);
  
  try {
    // 如果有已激活的应用，先卸载
    if (activeApp && activeAppLifecycle) {
      await unloadApp(activeApp, activeAppLifecycle);
    }
    
    // 使用加载器加载应用
    activeAppLifecycle = await loadApp(app);
    
    // 设置当前激活的应用
    activeApp = app;
    
    console.log(`微应用 ${app.name} 已加载`);
  } catch (error) {
    console.error(`加载微应用 ${app.name} 失败:`, error);
  }
}

/**
 * 根据路由匹配微应用
 */
function matchMicroApp() {
  const path = window.location.pathname;
  const app = microApps.find(app => path.startsWith(app.activeRule));
  
  if (app && (!activeApp || activeApp.name !== app.name)) {
    loadMicroApp(app);
  }
}

/**
 * 启动微前端框架
 */
export function start() {
  console.log('启动微前端框架');
  
  // 初始匹配
  matchMicroApp();
  
  // 监听路由变化
  window.addEventListener('popstate', () => {
    matchMicroApp();
  });
  
  // 拦截点击事件，处理内部路由跳转
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A') {
      const href = target.href;
      if (href && href.startsWith(window.location.origin)) {
        e.preventDefault();
        window.history.pushState(null, '', href);
        matchMicroApp();
      }
    }
  });
}