// 微应用加载器

/**
 * 微应用生命周期接口
 * @typedef {Object} MicroAppLifecycle
 * @property {Function} [beforeMount] - 挂载前钩子
 * @property {Function} [mounted] - 挂载后钩子
 * @property {Function} [beforeUnmount] - 卸载前钩子
 * @property {Function} [unmounted] - 卸载后钩子
 */

/**
 * 加载微应用
 * @param {Object} app - 微应用配置
 * @param {string} app.name - 微应用名称
 * @param {string} app.entry - 微应用入口
 * @param {string} app.container - 微应用容器
 * @returns {Promise<MicroAppLifecycle>} 微应用生命周期
 */
export async function loadApp(app) {
  const container = document.querySelector(app.container);
  if (!container) {
    throw new Error(`容器 ${app.container} 不存在`);
  }

  // 清空容器
  container.innerHTML = '';

  // 创建div容器来加载微应用
  const appContainer = document.createElement('div');
  appContainer.id = `${app.name}-container`;
  container.appendChild(appContainer);

  // 加载微应用入口脚本
  const script = document.createElement('script');
  script.src = app.entry;
  script.type = 'module';

  // 定义生命周期钩子
  const lifecycle = {
    beforeMount: async () => {
      console.log(`${app.name} beforeMount`);
      // 这里可以添加应用加载前的准备工作
    },
    mounted: async () => {
      console.log(`${app.name} mounted`);
      // 这里可以添加应用加载后的初始化工作
    },
    beforeUnmount: async () => {
      console.log(`${app.name} beforeUnmount`);
      // 这里可以添加应用卸载前的清理工作
    },
    unmounted: async () => {
      console.log(`${app.name} unmounted`);
      // 这里可以添加应用卸载后的清理工作
    }
  };

  // 加载并执行入口脚本
  await new Promise((resolve, reject) => {
    script.onload = async () => {
      try {
        if (lifecycle.mounted) {
          await lifecycle.mounted();
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });

  return lifecycle;
}

/**
 * 卸载微应用
 * @param {Object} app - 微应用配置
 * @param {MicroAppLifecycle} [lifecycle] - 微应用生命周期
 * @returns {Promise<void>}
 */
export async function unloadApp(app, lifecycle) {
  if (lifecycle?.beforeUnmount) {
    await lifecycle.beforeUnmount();
  }

  const container = document.querySelector(app.container);
  if (container) {
    container.innerHTML = '';
  }

  if (lifecycle?.unmounted) {
    await lifecycle.unmounted();
  }
}