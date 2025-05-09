# 微前端框架 (JavaScript版本)

这是一个基于纯JavaScript实现的简化版微前端框架，无需构建步骤，可直接在浏览器中运行和调试。

## 特点

- 纯JavaScript实现，无需TypeScript和构建步骤
- 支持微应用的注册、加载和卸载
- 提供全局状态管理和通信机制
- 基于路由的微应用匹配和切换
- 使用iframe隔离微应用

## 使用方法

### 在主应用中引入

```html
<script type="module">
  import { registerMicroApps, start } from '/path/to/qiankun/packages/micro/src/index.js';
  
  // 注册微应用
  registerMicroApps([
    {
      name: 'app1',
      entry: 'http://localhost:3001/',
      container: '#microapp-container',
      activeRule: '/app1'
    },
    {
      name: 'app2',
      entry: 'http://localhost:3002/',
      container: '#microapp-container',
      activeRule: '/app2'
    }
  ]);
  
  // 启动框架
  start();
</script>
```

### 全局状态管理

```javascript
import { initGlobalState, onGlobalStateChange, setGlobalState, getGlobalState } from '/path/to/qiankun/packages/micro/src/communication.js';

// 初始化全局状态
initGlobalState({
  user: { name: '张三', id: 1 },
  theme: 'light'
});

// 监听状态变化
const unsubscribe = onGlobalStateChange('user', (newValue, oldValue) => {
  console.log('用户信息变化:', newValue, oldValue);
});

// 修改状态
setGlobalState('theme', 'dark');

// 获取状态
const theme = getGlobalState('theme');
console.log('当前主题:', theme);

// 取消监听
unsubscribe();
```

## 调试方法

由于框架使用纯JavaScript实现，无需构建步骤，可以直接在浏览器中调试：

1. 在浏览器开发者工具中设置断点
2. 使用`console.log`输出调试信息
3. 直接修改源代码并刷新页面查看效果

## 文件结构

- `src/index.js` - 框架主入口，提供微应用注册和启动功能
- `src/loader.js` - 微应用加载器，负责加载和卸载微应用
- `src/communication.js` - 通信模块，提供全局状态管理功能