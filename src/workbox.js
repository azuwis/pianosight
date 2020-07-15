import { Workbox } from 'workbox-window'
import { notification } from './stores.js'

let workbox

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    workbox = new Workbox('/service-worker.js')

    workbox.addEventListener('installed', event => {
      if (event.isUpdate) {
        notification.set('Updating app...')
        setTimeout(() => window.location.reload(), 1500)
      }
    })

    workbox.register()
  }
}

export function updateServiceWorker() {
  if (workbox) {
    workbox.update()
  } else {
    console.log('Service worker not registered.')
  }
}
