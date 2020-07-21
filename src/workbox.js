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

export async function updateServiceWorker() {
  if (workbox) {
    notification.set('Checking for update...')
    await workbox.update()
    const reg = workbox.p
    if (reg.installing || reg.waiting) {
    } else {
      notification.set('Already latest version')
      setTimeout(() => {
        notification.set('')
      }, 1000)
    }
  } else {
    console.log('Service worker not registered.')
  }
}
