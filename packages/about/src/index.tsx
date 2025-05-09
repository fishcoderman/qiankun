import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const domContainer = container ? container.querySelector('#root') : document.querySelector('#root');
  
  root = ReactDOM.createRoot(domContainer);
  root.render(
      <App />
  );
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('about app bootstraped');
}

export async function mount(props: any) {
  console.log('about app mounted');
  render(props);
}

export async function unmount(props: any) {
  console.log('about app unmounted');
  if (root) {
    root.unmount();
  }
}
