import App from './App.svelte';
import './index.css';

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
}

const app = new App({
  target: document.body,
});

export default app;
