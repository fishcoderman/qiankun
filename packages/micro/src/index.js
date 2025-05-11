/**
 * 简化版qiankun微前端框架
 * 实现了基本的应用注册、加载和生命周期管理功能
 */
window.__POWERED_BY_QIANKUN__ = true;
// 存储已注册的微应用列表
let microApps = [];

// 当前激活的微应用
let activeApp = null;

// 是否已启动
let isStarted = false;

/**
 * 注册微应用
 * @param {Array} apps - 微应用配置列表
 * @param {Object} lifeCycles - 全局生命周期钩子
 */
export function registerMicroApps(apps, lifeCycles = {}) {
  microApps = apps.map(app => ({
    ...app,
    status: 'NOT_LOADED', // 初始状态：未加载
    loadedAssets: null, // 加载的资源
    bootstrap: null, // 启动函数
    mount: null, // 挂载函数
    unmount: null, // 卸载函数
  }));
  
  console.log('已注册的微应用:', microApps);
  return microApps;
}

/**
 * 启动微前端框架
 * @param {Object} options - 启动选项
 */
export function start(options = {}) {
  if (isStarted) {
    console.warn('微前端框架已经启动，请勿重复启动');
    return;
  }
  
  isStarted = true;
  console.log('微前端框架启动');
  
  // 初始化路由监听
  initRouteListener();
  
  // 根据当前路由加载对应的微应用
  reroute();
}

/**
 * 初始化路由监听
 */
function initRouteListener() {
  // 监听 popstate 事件
  window.addEventListener('popstate', () => {
    reroute();
  });
  
  // 重写 pushState 和 replaceState 方法
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  
  window.history.pushState = function(...args) {
    originalPushState.apply(this, args);
    reroute();
  };
  
  window.history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    reroute();
  };
}

/**
 * 根据当前路由重新加载微应用
 */
function reroute() {
  const { pathname } = window.location;
  // 查找匹配当前路由的微应用
  const app = findAppByRoute(pathname);
  
  // 如果找到匹配的应用且与当前激活的应用不同，则切换应用
  if (app && (!activeApp || activeApp.name !== app.name)) {
    // 卸载当前应用
    if (activeApp) {
      unloadApp(activeApp);
    }
    
    // 加载新应用
    loadApp(app);
  }

  if (!app && activeApp) {
    unloadApp(activeApp);
  }
}

/**
 * 根据路由查找对应的微应用
 * @param {string} route - 当前路由路径
 * @returns {Object|null} - 匹配的微应用配置或null
 */
function findAppByRoute(route) {
  return microApps.find(app => {
    if (typeof app.activeRule === 'string') {
      return route.startsWith(app.activeRule);
    } else if (app.activeRule instanceof RegExp) {
      return app.activeRule.test(route);
    } else if (typeof app.activeRule === 'function') {
      return app.activeRule(route);
    }
    return false;
  });
}

/**
 * 加载微应用
 * @param {Object} app - 微应用配置
 */
async function loadApp(app) {
  console.log(`开始加载微应用: ${app.name}`, app);
  
  try {
    // 更新应用状态
    app.status = 'LOADING';
    
    // 获取微应用的入口资源
    const assets = await fetchAppAssets(app.entry);
    app.loadedAssets = assets;
    
    // 将微应用的JS脚本注入到主应用中
    const appExports = await executeScripts(assets.scripts);
  
    // 获取微应用的生命周期函数
    const { bootstrap, mount, unmount } = getLifecycleFunctions(appExports);
  
    app.bootstrap = bootstrap;
    app.mount = mount;
    app.unmount = unmount;
    
    // 更新应用状态
    app.status = 'LOADED';
    
    // 启动微应用
    await app.bootstrap();

    // 挂载微应用到容器
    const container = document.querySelector(app.container);
    if (!container) {
      throw new Error(`容器 ${app.container} 不存在`);
    }
    container.innerHTML = assets.html;

    
    // 挂载应用
    await app.mount({
      container,
      basename: app.activeRule,
    });
    
    // 更新应用状态和当前激活的应用
    app.status = 'MOUNTED';
    activeApp = app;
    
    console.log(`微应用 ${app.name} 挂载成功`);
  } catch (error) {
    console.error(`加载微应用 ${app.name} 失败:`, error);
    app.status = 'LOAD_ERROR';
  }
}

/**
 * 卸载微应用
 * @param {Object} app - 微应用配置
 */
async function unloadApp(app) {
  if (app.status !== 'MOUNTED') return;
  
  console.log(`开始卸载微应用: ${app.name}`);
  
  try {
    // 执行应用的卸载函数
    await app.unmount();

    // 清空容器内容
    const container = document.querySelector(app.container);
    if (container) {
      container.innerHTML = '';
    }
    
    // 更新应用状态
    app.status = 'NOT_MOUNTED';
    activeApp = null;
    
    console.log(`微应用 ${app.name} 卸载成功`);
  } catch (error) {
    console.error(`卸载微应用 ${app.name} 失败:`, error);
  }
}

/**
 * 获取资源
 * @param {string} url 
 * @returns 
 */
export const fetchResource = url => fetch(url).then(res => res.text());

/**
 * 获取微应用的入口资源
 * @param {string} entry - 微应用的入口URL
 * @returns {Promise<Object>} - 解析出的JS和CSS资源
 */
async function fetchAppAssets(entry) {
  // 确保entry是完整的URL
  const entryUrl = entry.startsWith('http') ? entry : `http:${entry}`;
  
  try {
    // 获取入口HTML
    const html = await fetchResource(entryUrl);
    
    
    // 创建一个临时的DOM解析HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 提取所有JS和CSS资源
    const scripts = Array.from(doc.querySelectorAll('script'))
      .map(  script => {
        const src = script.src;
        if (src) {
          return  fetchResource(src.startsWith('http')? src : new URL(src, entryUrl).href);
        }else {
          return Promise.resolve(script.innerHTML);
        }
      });
    
    return { html, scripts };
  } catch (error) {
    console.error('获取微应用资源失败:', error);
    throw error;
  }
}

/**
 * 执行微应用的JS脚本
 * @param {Array} scripts - 脚本URL列表
 * @returns {Promise<Object>} - 微应用导出的内容
 */
async function executeScripts(scripts) {
  const module = {exports: {}}; 
  const exports = module.exports;

  for (const script of scripts) {
    try {
      const scriptContent = await script;
      // 创建一个新的Function来执行脚本，并将exports对象传入
      const scriptFunction = new Function('module', 'exports', scriptContent);
      scriptFunction(module, exports);
    } catch (error) {
      console.error(`执行脚本 ${scriptUrl} 失败:`, error);
    }
  }
  
  return module.exports;
}

/**
 * 获取微应用的生命周期函数
 * @param {Object} appExports - 微应用导出的内容
 * @returns {Object} - 生命周期函数
 */
function getLifecycleFunctions(appExports) {
  // 默认的生命周期函数
  const defaultLifecycle = {
    bootstrap: async () => {},
    mount: async () => {},
    unmount: async () => {},
  };
  
  // 尝试从不同的导出格式中获取生命周期函数
  const lifecycle = appExports.default || appExports;
  
  return {
    bootstrap: lifecycle.bootstrap || defaultLifecycle.bootstrap,
    mount: lifecycle.mount || defaultLifecycle.mount,
    unmount: lifecycle.unmount || defaultLifecycle.unmount,
  };
}