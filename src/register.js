import { register } from 'register-service-worker'
import { notification } from './stores.js'

let registration

if (process.env.NODE_ENV === 'production') {
  register('/service-worker.js', {
    registrationOptions: { scope: './' },
    ready (reg) {
      registration = reg
    },
    cached (reg) {
    },
    updatefound (reg) {
      notification.set('Downloading update...')
    },
    updated (reg) {
      notification.set('Updating app...')
      setTimeout(() => window.location.reload(), 1500)
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

export function updateServiceWorker() {
  if (registration) {
    notification.set('Checking update...')
    registration.update().then(reg => {
      if (!reg.installing && !reg.waiting) {
        notification.set('Already updated')
        setTimeout(() => {
          notification.set('')
        }, 1500)
      }
    })
  }
}
