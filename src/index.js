import { Workbox } from 'workbox-window';
import App from './App.svelte';
import './index.css';

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');

    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        window.location.reload();
      }
    });

    wb.register();
  }
}

const app = new App({
  target: document.body,
});

export default app;
