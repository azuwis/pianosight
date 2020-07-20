if ('wakeLock' in navigator) {
  let wakeLock = null
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen')
    } catch (err) {
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
