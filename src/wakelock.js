if ('wakeLock' in navigator) {
  let wakeLock = null
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen')
    } catch (error) {
      console.error('Error during request wakelock:', error)
    }
  }

  const onVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock()
    }
  }

  requestWakeLock()
  document.addEventListener('visibilitychange', onVisibilityChange)
}
