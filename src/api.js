import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'api'
})
// Agrega el token a cada petición si hay sesión
api.interceptors.request.use(config => {
  try {
    const raw = localStorage.getItem('usuario')
    if (raw) {
      const { access_token } = JSON.parse(raw)
      if (access_token) config.headers.Authorization = `Bearer ${access_token}`
    }
  } catch (e) { /* sesión corrupta: se ignora */ }
  return config
})

// El token expira (30 min por defecto en tu back): si llega 401, limpia la sesión
api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) localStorage.removeItem('usuario')
    return Promise.reject(error)
  }
)

// Convierte el error de FastAPI en texto legible (evita "[object Object]")
export function mensajeError(error, porDefecto = 'Ocurrió un error.') {
  const d = error.response?.data?.detail
  if (Array.isArray(d)) return d.map(e => `${(e.loc || []).slice(1).join('.')}: ${e.msg}`).join(', ')
  return d || porDefecto
}

export default api