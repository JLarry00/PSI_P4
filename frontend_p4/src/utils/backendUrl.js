export function backendUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
    return path
  }

  if (import.meta.env.DEV) {
    return path.startsWith('/') ? path : `/${path}`
  }

  const activeBackend = import.meta.env.VITE_ACTIVE_BACKEND === 'local' ? 'local' : 'render'
  const selectedBase =
    activeBackend === 'local'
      ? import.meta.env.VITE_BACKEND_URL_LOCAL
      : import.meta.env.VITE_BACKEND_URL_RENDER
  const base = (selectedBase ?? '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}
