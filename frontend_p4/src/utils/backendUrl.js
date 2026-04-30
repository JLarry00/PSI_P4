export function backendUrl(path) {
    const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
    const p = path.startsWith('/') ? path : `/${path}`
    return base ? `${base}${p}` : p
  }