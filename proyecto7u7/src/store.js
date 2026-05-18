// src/store.js — Estado global con localStorage (sin Vuex)
const store = {

  // ── SESIÓN ──────────────────────────────────────────────
  getUsuario() {
    const u = localStorage.getItem('ms_usuario')
    return u ? JSON.parse(u) : null
  },
  setUsuario(usuario) {
    localStorage.setItem('ms_usuario', JSON.stringify(usuario))
  },
  cerrarSesion() {
    localStorage.removeItem('ms_usuario')
  },
  estaLogueado() {
    return !!this.getUsuario()
  },

  // ── USUARIOS REGISTRADOS ────────────────────────────────
  getUsuarios() {
    const u = localStorage.getItem('ms_usuarios')
    return u ? JSON.parse(u) : []
  },
  registrarUsuario(alias, email, password) {
    const usuarios = this.getUsuarios()
    if (usuarios.find(u => u.alias === alias))
      return { ok: false, msg: 'Ese alias ya está en uso' }
    if (usuarios.find(u => u.email === email))
      return { ok: false, msg: 'Ese correo ya está registrado' }
    const nuevo = { alias, email, password, fechaRegistro: new Date().toISOString() }
    usuarios.push(nuevo)
    localStorage.setItem('ms_usuarios', JSON.stringify(usuarios))
    this.setUsuario({ alias, email })
    return { ok: true }
  },
  login(alias, password) {
    const usuarios = this.getUsuarios()
    const u = usuarios.find(u => u.alias === alias && u.password === password)
    if (!u) return { ok: false, msg: 'Alias o contraseña incorrectos' }
    this.setUsuario({ alias: u.alias, email: u.email })
    return { ok: true }
  },

  // ── POSTS ───────────────────────────────────────────────
  getPosts() {
    const p = localStorage.getItem('ms_posts')
    if (p) return JSON.parse(p)
    const colores = {
      'Ansiedad':   { mood: 'linear-gradient(90deg,#6B9E78,#A8CDB0)', bg: '#E8F3EB', fg: '#4A7C59' },
      'Depresión':  { mood: 'linear-gradient(90deg,#9B7FA8,#C4A8CC)', bg: '#F0EAF5', fg: '#7A5A8A' },
      'Duelo':      { mood: 'linear-gradient(90deg,#C4876A,#DBA882)', bg: '#F5EDE8', fg: '#8C5A3A' },
      'Autoestima': { mood: 'linear-gradient(90deg,#6B8FA8,#8AACBF)', bg: '#E8EAF5', fg: '#4A5A8A' },
    }
    const iniciales = [
      { id: 1, votos: 247, categoria: '🌊 Ansiedad', categoriaKey: 'Ansiedad', tiempo: 'hace 2h', seccion: 'populares', autor: 'Anónimo_7284', votantes: [], titulo: '¿Alguien más siente que sus ataques de pánico empeoran en verano?', extracto: 'Llevo meses intentando entender por qué el calor me dispara la ansiedad. He leído que la temperatura afecta el sistema nervioso, pero quería saber si a otros les pasa lo mismo y qué estrategias han encontrado...' },
      { id: 2, votos: 183, categoria: '🌧️ Depresión', categoriaKey: 'Depresión', tiempo: 'hace 5h', seccion: 'populares', autor: 'Anónimo_3921', votantes: [], titulo: 'Después de 3 años de terapia, hoy tuve mi primer día completamente bueno', extracto: 'Quería compartirlo porque sé que muchos están en ese punto donde parece que nada cambia. Hoy me desperté y simplemente... estuve bien. Comí bien, salí a caminar, no lloré ni una vez...' },
      { id: 3, votos: 96,  categoria: '🕊️ Duelo',    categoriaKey: 'Duelo',    tiempo: 'hace 8h', seccion: 'populares', autor: 'Anónimo_5512', votantes: [], titulo: 'No sé cómo hablar del duelo de una mascota sin que la gente lo minimice', extracto: 'Perdí a mi perro hace dos semanas y la gente me dice "era solo un animal". Pero era mi compañero de 12 años, mi apoyo emocional durante la pandemia. ¿Alguien ha pasado por esto?' },
      { id: 4, votos: 74,  categoria: '⭐ Autoestima',categoriaKey: 'Autoestima',tiempo: 'hace 11h',seccion: 'populares', autor: 'Anónimo_8803', votantes: [], titulo: 'Comencé a escribir un diario y no puedo creer la diferencia que ha hecho', extracto: 'Siempre pensé que era una tontería pero mi psicólogo me insistió. Llevo 6 semanas y ya veo patrones en mis emociones que nunca había notado...' },
      { id: 5, votos: 12,  categoria: '🌧️ Depresión', categoriaKey: 'Depresión', tiempo: 'hace 1h',  seccion: 'reciente', autor: 'Anónimo_1190', votantes: [], titulo: 'Días grises sin razón aparente', extracto: 'No entiendo por qué algunos días me levanto bien y otros simplemente no puedo. No pasó nada malo, solo me siento pesado por dentro...' },
      { id: 6, votos: 3,   categoria: '🌊 Ansiedad',  categoriaKey: 'Ansiedad',  tiempo: 'hace 20 min', seccion: 'reciente', autor: 'Anónimo_4471', votantes: [], titulo: '¿Alguien usa respiración 4-7-8 para dormir?', extracto: 'Mi terapeuta me lo recomendó pero no logro hacerlo bien. ¿Alguien tiene tips? Me cuesta mucho retener el aliento 7 segundos...' },
    ].map(p => ({ ...p, ...colores[p.categoriaKey] }))
    localStorage.setItem('ms_posts', JSON.stringify(iniciales))
    return iniciales
  },
  savePosts(posts) {
    localStorage.setItem('ms_posts', JSON.stringify(posts))
  },
  agregarPost(titulo, extracto, categoriaKey, autor) {
    const posts = this.getPosts()
    const mapCat = { Ansiedad: '🌊 Ansiedad', 'Depresión': '🌧️ Depresión', Duelo: '🕊️ Duelo', Autoestima: '⭐ Autoestima', Noticias: '🌱 Noticias' }
    const colores = {
      'Ansiedad':   { mood: 'linear-gradient(90deg,#6B9E78,#A8CDB0)', bg: '#E8F3EB', fg: '#4A7C59' },
      'Depresión':  { mood: 'linear-gradient(90deg,#9B7FA8,#C4A8CC)', bg: '#F0EAF5', fg: '#7A5A8A' },
      'Duelo':      { mood: 'linear-gradient(90deg,#C4876A,#DBA882)', bg: '#F5EDE8', fg: '#8C5A3A' },
      'Autoestima': { mood: 'linear-gradient(90deg,#6B8FA8,#8AACBF)', bg: '#E8EAF5', fg: '#4A5A8A' },
      'Noticias':   { mood: 'linear-gradient(90deg,#6B9E78,#A8CDB0)', bg: '#EAF5EA', fg: '#3A6449' },
    }
    const c = colores[categoriaKey] || colores['Ansiedad']
    const nuevo = {
      id: Date.now(),
      votos: 1, votantes: [autor],
      categoria: mapCat[categoriaKey] || categoriaKey,
      categoriaKey,
      tiempo: 'ahora mismo',
      seccion: 'reciente',
      autor,
      titulo, extracto,
      ...c
    }
    posts.unshift(nuevo)
    this.savePosts(posts)
    return nuevo
  },
  votar(postId, alias, dir) {
    const posts = this.getPosts()
    const post = posts.find(p => p.id === postId)
    if (!post) return
    if (!post.votantes) post.votantes = []
    const idx = post.votantes.indexOf(alias)
    if (idx > -1) {
      post.votantes.splice(idx, 1)
      post.votos -= 1
    } else {
      post.votantes.push(alias)
      post.votos += dir
    }
    this.savePosts(posts)
    return post
  },

  // ── COMENTARIOS ─────────────────────────────────────────
  getComentarios(postId) {
    const c = localStorage.getItem(`ms_comments_${postId}`)
    return c ? JSON.parse(c) : []
  },
  agregarComentario(postId, texto, autor) {
    const comments = this.getComentarios(postId)
    const nuevo = {
      id: Date.now(),
      texto,
      autor,
      fecha: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
    }
    comments.push(nuevo)
    localStorage.setItem(`ms_comments_${postId}`, JSON.stringify(comments))
    return nuevo
  },

  // ── PSICÓLOGOS (datos locales) ──────────────────────────
  getPsicologos() {
    return [
      { id:1,  nombre:'Dra. Ana Ruiz',       descripcion:'Especialista en ansiedad',       correo:'ana@gmail.com',       ubicacion:'Santa Marta',  imagen:'https://randomuser.me/api/portraits/women/10.jpg' },
      { id:2,  nombre:'Dr. Carlos Mora',     descripcion:'Terapia cognitivo-conductual',   correo:'carlos@gmail.com',    ubicacion:'Barranquilla', imagen:'https://randomuser.me/api/portraits/men/11.jpg'   },
      { id:3,  nombre:'Dra. Laura Vega',     descripcion:'Depresión y estrés',             correo:'laura@gmail.com',     ubicacion:'Cartagena',    imagen:'https://randomuser.me/api/portraits/women/12.jpg' },
      { id:4,  nombre:'Dra. María López',    descripcion:'Ansiedad y estrés laboral',      correo:'maria@gmail.com',     ubicacion:'Bogotá',       imagen:'https://randomuser.me/api/portraits/women/13.jpg' },
      { id:5,  nombre:'Dr. Andrés Gómez',    descripcion:'Terapia familiar',               correo:'andres@gmail.com',    ubicacion:'Medellín',     imagen:'https://randomuser.me/api/portraits/men/14.jpg'   },
      { id:6,  nombre:'Dra. Sofía Martínez', descripcion:'Depresión clínica',              correo:'sofia@gmail.com',     ubicacion:'Cali',         imagen:'https://randomuser.me/api/portraits/women/15.jpg' },
      { id:7,  nombre:'Dr. Luis Torres',     descripcion:'Psicología infantil',            correo:'luis@gmail.com',      ubicacion:'Barranquilla', imagen:'https://randomuser.me/api/portraits/men/16.jpg'   },
      { id:8,  nombre:'Dra. Camila Rojas',   descripcion:'Autoestima y desarrollo personal',correo:'camila@gmail.com',  ubicacion:'Cartagena',    imagen:'https://randomuser.me/api/portraits/women/17.jpg' },
      { id:9,  nombre:'Dr. Juan Pérez',      descripcion:'Adicciones',                     correo:'juan@gmail.com',      ubicacion:'Santa Marta',  imagen:'https://randomuser.me/api/portraits/men/18.jpg'   },
      { id:10, nombre:'Dra. Valentina Castro',descripcion:'Relaciones de pareja',          correo:'valentina@gmail.com', ubicacion:'Bogotá',       imagen:'https://randomuser.me/api/portraits/women/19.jpg' },
      { id:11, nombre:'Dr. Daniel Ruiz',     descripcion:'Trastornos emocionales',         correo:'daniel@gmail.com',    ubicacion:'Medellín',     imagen:'https://randomuser.me/api/portraits/men/20.jpg'   },
      { id:12, nombre:'Dra. Paula Moreno',   descripcion:'Terapia de duelo',               correo:'paula@gmail.com',     ubicacion:'Cartagena',    imagen:'https://randomuser.me/api/portraits/women/21.jpg' },
    ]
  },
  getPsicologoPorId(id) {
    return this.getPsicologos().find(p => p.id === parseInt(id)) || null
  }
}

export default store