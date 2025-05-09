// 微应用通信模块

// 全局状态存储
const globalState = {};

// 监听器集合
const listeners = {};

/**
 * 设置全局状态
 * @param {string} key 状态键名
 * @param {any} value 状态值
 */
export function setGlobalState(key, value) {
  const oldValue = globalState[key];
  globalState[key] = value;
  
  // 触发监听器
  if (listeners[key]) {
    listeners[key].forEach(listener => listener(value, oldValue));
  }
}

/**
 * 获取全局状态
 * @param {string} key 状态键名
 * @returns {any} 状态值
 */
export function getGlobalState(key) {
  return globalState[key];
}

/**
 * 监听全局状态变化
 * @param {string} key 状态键名
 * @param {Function} callback 回调函数
 * @returns {Function} 取消监听的函数
 */
export function onGlobalStateChange(key, callback) {
  if (!listeners[key]) {
    listeners[key] = [];
  }
  
  listeners[key].push(callback);
  
  // 返回取消监听的函数
  return () => {
    const index = listeners[key].indexOf(callback);
    if (index !== -1) {
      listeners[key].splice(index, 1);
    }
  };
}

/**
 * 初始化全局状态
 * @param {Object} state 初始状态对象
 */
export function initGlobalState(state) {
  Object.keys(state).forEach(key => {
    setGlobalState(key, state[key]);
  });
}