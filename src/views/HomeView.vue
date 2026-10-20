<template>
  <div class="app-layout">
    <!-- ════════════ MODAL PUBLICAR ════════════ -->
    <div v-if="modalPublicar" class="modal-overlay" @click.self="modalPublicar = false">
      <div class="modal-box">
        <div class="modal-head">
          <span class="modal-title">Nueva publicación</span>
          <button class="modal-close" @click="modalPublicar = false">✕</button>
        </div>
        <div v-if="!usuarioActual" class="modal-no-auth">
          <div class="modal-no-auth-icon">🔒</div>
          <p>Necesitas una cuenta para publicar</p>
          <button class="btn-green" @click="irARegistro">Crear cuenta gratis</button>
        </div>
        <div v-else class="modal-form">
          <input v-model="nuevaPublicacion.titulo" class="modal-input" placeholder="Título de tu publicación..." maxlength="120" />
          <div class="char-count">{{ nuevaPublicacion.titulo.length }}/120</div>
          <textarea v-model="nuevaPublicacion.extracto" class="modal-textarea" placeholder="Comparte lo que sientes... este es tu espacio seguro." rows="5"></textarea>
          <select v-model="nuevaPublicacion.categoriaKey" class="modal-select">
            <option value="">Selecciona una categoría</option>
            <option value="Ansiedad">🌡️ Ansiedad</option>
            <option value="Depresión">🌧️ Depresión</option>
            <option value="Duelo">🕊️ Duelo y Pérdida</option>
            <option value="Autoestima">⭐ Autoestima</option>
            <option value="Noticias">🌱 Noticias de Salud</option>
          </select>
          <div v-if="errorPublicar" class="modal-error">{{ errorPublicar }}</div>
          <div class="modal-actions">
            <button class="btn-ghost-sm" @click="modalPublicar = false">Cancelar</button>
            <button class="btn-green" @click="publicar">Publicar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════ MODAL POST DETALLE ════════════ -->
    <div v-if="postActivo" class="modal-overlay" @click.self="postActivo = null">
      <div class="modal-box modal-wide">
        <div class="modal-head">
          <span class="tag-community">r/salud_mental</span>
          <button class="modal-close" @click="postActivo = null">✕</button>
        </div>
        <div class="modal-scroll">
          <div class="modal-bar" :style="{ background: postActivo.mood }"></div>
          <div class="modal-post-header">
            <div class="modal-vote-row">
              <button class="vote-btn" :class="{ voted: postActivo.votantes && postActivo.votantes.includes(usuarioActual?.alias) }" @click="votarPost(postActivo, 1)">▲</button>
              <span class="vote-count">{{ postActivo.votos }}</span>
              <button class="vote-btn" @click="votarPost(postActivo, -1)">▼</button>
            </div>
            <div>
              <div class="modal-post-titulo">{{ postActivo.titulo }}</div>
              <div class="modal-post-meta">
                <span class="tag-category">{{ postActivo.categoria }}</span>
                <span class="modal-post-autor">{{ postActivo.autor }}</span>
                <span class="card-time">{{ postActivo.tiempo }}</span>
              </div>
            </div>
          </div>
          <p class="modal-post-body">{{ postActivo.extracto }}</p>
          <div class="modal-divider"></div>

          <!-- COMENTARIOS -->
          <div v-if="comentariosActivos.length > 0" class="modal-comments-title">{{ comentariosActivos.length }} respuestas</div>
          <div v-else class="modal-comments-title">Sé el primero en responder 💬</div>

          <div v-if="usuarioActual" class="modal-comment-form">
            <div class="anon-avatar-sm" :style="{ background: avatarColor(usuarioActual.alias).bg, color: avatarColor(usuarioActual.alias).fg }">
              {{ usuarioActual.alias[0].toUpperCase() }}
            </div>
            <div class="comment-input-wrap">
              <textarea v-model="nuevoComentario" class="comment-textarea" placeholder="Escribe una respuesta..." rows="2" @keydown.ctrl.enter="enviarComentario"></textarea>
              <div class="comment-footer-bar">
                <span class="comment-hint">Ctrl+Enter para enviar</span>
                <button class="btn-green-sm" @click="enviarComentario">Responder</button>
              </div>
            </div>
          </div>
          <div v-else class="modal-login-prompt">
            <span>¿Quieres responder? </span>
            <button class="link-btn" @click="irARegistro">Inicia sesión o regístrate</button>
          </div>

          <div v-for="c in comentariosActivos" :key="c.id" class="comment-item">
            <div class="anon-avatar-sm" :style="{ background: avatarColor(c.autor).bg, color: avatarColor(c.autor).fg }">
              {{ c.autor[0].toUpperCase() }}
            </div>
            <div class="comment-bubble">
              <div class="comment-autor">{{ c.autor }} <span class="comment-fecha">· {{ c.fecha }}</span></div>
              <div class="comment-texto">{{ c.texto }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════════ SIDEBAR IZQUIERDO ════════════ -->
    <aside class="sidebar-left">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FFFAF5" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 11c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
            <circle cx="9.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
            <circle cx="14.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
          </svg>
        </div>
        <div class="brand-name">MenteSana</div>
        <div class="brand-tagline">Tu espacio seguro y anónimo</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <p class="section-label">Feeds</p>
          <button @click="seccionActual = 'populares'" :class="{ active: seccionActual === 'populares' }" class="nav-item">
            <span class="nav-icon" style="background:#E8F3EB;">🔥</span> Popular
          </button>
          <button @click="seccionActual = 'reciente'" :class="{ active: seccionActual === 'reciente' }" class="nav-item">
            <span class="nav-icon" style="background:#F0E4D4;">✨</span> Reciente
          </button>
        </div>

        <div class="nav-section">
          <p class="section-label">Temas de ayuda</p>
          <button @click="seccionActual = 'todos'" :class="{ active: seccionActual === 'todos' }" class="nav-item">
            <span class="nav-icon" style="background:#E8F3EB;">📋</span> Todos
          </button>
        </div>

        <div class="nav-section">
          <p class="section-label">Recursos</p>
          <router-link to="/psicologos" class="nav-item">
            <span class="nav-icon" style="background:#EAF0FB;">🧠</span> Psicólogos
          </router-link>
          <button class="nav-item" @click="abrirLineas">
            <span class="nav-icon" style="background:#FFF0E8;">📞</span> Líneas de Crisis
          </button>
        </div>

        <div class="nav-section">
          <p class="section-label">Usuario</p>
          <template v-if="usuarioActual">
            <div class="nav-item nav-user">
              <span class="nav-icon" :style="{ background: avatarColor(usuarioActual.alias).bg }">
                {{ usuarioActual.alias[0].toUpperCase() }}
              </span>
              {{ usuarioActual.alias }}
            </div>
            <button class="nav-item" @click="cerrarSesion">
              <span class="nav-icon" style="background:#FFF0E8;">🚪</span> Cerrar sesión
            </button>
          </template>
          <template v-else>
            <router-link to="/registro" class="nav-item">
              <span class="nav-icon" style="background:#E8F3EB;">✨</span> Registrarse
            </router-link>
            <router-link to="/registro?login=1" class="nav-item">
              <span class="nav-icon" style="background:#F5EDE8;">🔑</span> Iniciar sesión
            </router-link>
          </template>
        </div>
      </nav>
    </aside>

    <!-- ════════════ LADO DERECHO ════════════ -->
    <div class="right-wrapper">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="search-wrap">
          <svg class="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" v-model="busqueda" @input="buscar" placeholder="Buscar en la comunidad..." class="search-input">
        </div>
        <div class="topbar-right">
          <button class="btn-ghost" @click="modalPublicar = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Publicar
          </button>
          <template v-if="usuarioActual">
            <button class="btn-ghost anon-btn">
              <span class="anon-dot"></span>
              {{ usuarioActual.alias }}
            </button>
            <button class="btn-ghost" @click="cerrarSesion" title="Cerrar sesión">🚪</button>
          </template>
          <template v-else>
            <router-link to="/registro?login=1" class="btn-ghost">Iniciar sesión</router-link>
            <router-link to="/registro" class="btn-green-top">Registrarse</router-link>
          </template>
        </div>
      </header>

      <!-- CONTENIDO -->
      <main class="main-content">
        <div class="content-grid">

          <!-- COLUMNA POSTS -->
          <section class="posts-col">
            <div class="feed-header">
              <div class="feed-tabs">
                <button class="tab" :class="{ active: seccionActual === 'populares' }" @click="seccionActual = 'populares'">🔥 Popular</button>
                <button class="tab" :class="{ active: seccionActual === 'reciente' }" @click="seccionActual = 'reciente'">✨ Reciente</button>
                <button class="tab" :class="{ active: seccionActual === 'todos' }" @click="seccionActual = 'todos'">📋 Todo</button>
              </div>
              <button class="btn-publish" @click="modalPublicar = true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Publicar
              </button>
            </div>

            <!-- Indicador de búsqueda -->
            <div v-if="busqueda" class="search-badge">
              Resultados para "<strong>{{ busqueda }}</strong>" — {{ postsFiltrados.length }} encontrados
              <button @click="busqueda = ''" class="clear-search">✕</button>
            </div>

            <div v-if="postsFiltrados.length === 0 && !busqueda" class="empty-state">
                <div v-if="loadingPosts" class="loading-posts">
                  <div class="loading-item" v-for="i in 3" :key="i"></div>
                </div>
                <div v-else class="empty-feed">
                  <div class="empty-icon">🌱</div>
                  <p>No hay publicaciones aquí todavía.</p>
                  <button class="btn-green" @click="modalPublicar = true">Sé el primero en compartir</button>
                </div>
              </div>

              <template v-else-if="busqueda || postsFiltrados.length > 0">
              <div v-for="post in postsFiltrados" :key="post.id" class="post-card" @click="abrirPost(post)">
                <div class="mood-bar" :style="{ background: post.mood }"></div>
                <div class="card-inner">
                  <div class="vote-col" @click.stop>
                    <button class="vote-btn" :class="{ voted: post.votantes && post.votantes.includes(usuarioActual?.alias) }" @click="votarPost(post, 1)">▲</button>
                    <span class="vote-count">{{ post.votos }}</span>
                    <button class="vote-btn" @click="votarPost(post, -1)">▼</button>
                  </div>
                  <div class="card-body">
                    <div class="card-meta">
                      <span class="tag-community">r/salud_mental</span>
                      <span class="tag-category">{{ post.categoria }}</span>
                      <span class="card-time">{{ post.tiempo }}</span>
                    </div>
                    <div class="card-title">{{ post.titulo }}</div>
                    <div class="card-excerpt">{{ post.extracto }}</div>
                    <div class="card-footer" @click.stop>
                      <span class="card-action" @click="abrirPost(post)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        {{ getComentariosCount(post.id) }} respuestas
                      </span>
                      <span class="card-action" @click.stop="compartir(post)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        Compartir
                      </span>
                      <span class="card-action" @click.stop="votarPost(post, 1)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        Apoyar
                      </span>
                      <div class="anon-badge">
                        <div class="anon-avatar" :style="{ background: post.bg, color: post.fg }">
                          {{ post.autor[0].toUpperCase() }}
                        </div>
                        <span class="anon-name">{{ post.autor }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </section>

          <!-- SIDEBAR DERECHO -->
          <aside class="sidebar-right">

            <div class="widget">
              <div class="widget-banner">
                <div class="widget-banner-title">Sobre MenteSana</div>
                <p class="widget-banner-desc">Un espacio seguro y anónimo para compartir, escuchar y sanar. Aquí nadie juzga, todos acompañamos.</p>
                <button class="btn-join" @click="irARegistro">
                  {{ usuarioActual ? '✓ Ya eres miembro' : 'Unirse a la comunidad' }}
                </button>
              </div>
              <div class="stats-row">
                <div class="stat-box">
                  <div class="stat-val">{{ totalPosts }}</div>
                  <div class="stat-lbl">Publicaciones</div>
                </div>
                <div class="stat-box">
                  <div class="stat-val">{{ totalUsuarios }}</div>
                  <div class="stat-lbl">Miembros</div>
                </div>
              </div>
            </div>

            <div class="widget">
              <div class="widget-head">🆘 Recursos de ayuda</div>
              <a href="https://www.asivamosensalud.org" target="_blank" class="resource-item">
                <div class="resource-ico" style="background:#E8F3EB;">📞</div>
                <div>
                  <div class="resource-name">Línea Nacional de Apoyo</div>
                  <div class="resource-desc">Atención 24/7 · Gratuita · Confidencial</div>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A89880" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
              <router-link to="/psicologos" class="resource-item">
                <div class="resource-ico" style="background:#F0EAF5;">🧠</div>
                <div>
                  <div class="resource-name">Chat con Psicólogo</div>
                  <div class="resource-desc">Directorio de especialistas</div>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A89880" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </router-link>
              <div class="resource-item" style="border-bottom:none;">
                <div class="resource-ico" style="background:#FFF0E8;">🌐</div>
                <div>
                  <div class="resource-name">¿Crisis ahora?</div>
                  <div class="resource-desc">Llama al 106 — línea gratuita</div>
                </div>
              </div>
            </div>

            <div class="widget">
              <div class="widget-head">Normas de la comunidad</div>
              <div class="rules-wrap">
                <div class="rule-item"><span class="rule-num">1</span><span>No juzgar ni minimizar la experiencia del otro</span></div>
                <div class="rule-item"><span class="rule-num">2</span><span>Respetar el anonimato de todos</span></div>
                <div class="rule-item"><span class="rule-num">3</span><span>Ser empático y amable siempre</span></div>
                <div class="rule-item" style="border-bottom:none;"><span class="rule-num">4</span><span>En crisis, recurrir a ayuda profesional</span></div>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import api from '../api'


const AVATAR_PALETTES = [
  { bg: '#E8F3EB', fg: '#4A7C59' },
  { bg: '#F0EAF5', fg: '#7A5A8A' },
  { bg: '#F5EDE8', fg: '#8C5A3A' },
  { bg: '#E8EAF5', fg: '#4A5A8A' },
  { bg: '#FFF0E8', fg: '#8C5A3A' },
  { bg: '#EAF5EA', fg: '#3A6449' },
]

export default {
  name: 'HomeView',
  data() {
    return {
      seccionActual: 'populares',
      busqueda: '',
      posts: [],
      postActivo: null,
      comentariosActivos: [],
      nuevoComentario: '',
      modalPublicar: false,
      nuevaPublicacion: { titulo: '', extracto: '', categoriaKey: '' },
      errorPublicar: '',
      usuarioActual: null,
      usuarioLogueado: null,
      contadorComentarios: {},
      psicologos: [],
      loadingPosts: false
    }
  },
  computed: {
    postsFiltrados() {
      let lista = this.posts
      if (this.busqueda.trim()) {
        const q = this.busqueda.toLowerCase()
        lista = lista.filter(p =>
          p.titulo.toLowerCase().includes(q) ||
          p.extracto.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
        )
        return lista
      }
      const mapSec = {
        populares:  () => true,
        reciente:   p => p.seccion === 'reciente',
        todos:      () => true,
        ansiedad:   p => p.categoriaKey === 'Ansiedad',
        depresion:  p => p.categoriaKey === 'Depresión',
        duelo:      p => p.categoriaKey === 'Duelo',
        autoestima: p => p.categoriaKey === 'Autoestima',
        noticias:   p => p.categoriaKey === 'Noticias',
      }
      const fn = mapSec[this.seccionActual] || (() => true)
      lista = lista.filter(fn)
      if (this.seccionActual === 'populares') lista = [...lista].sort((a, b) => b.votos - a.votos)
      return lista
    },
    totalPosts() { return this.posts.length },
    totalUsuarios() {
      return this.psicologos.length + 847
    }
  },
  methods: {
    avatarColor(alias) {
      const idx = alias.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTES.length
      return AVATAR_PALETTES[idx]
    },
    getComentariosCount(postId) {
      return this.contadorComentarios[postId] ?? 0
    },

    // ===================== MÉTODOS API =====================

    async cargarPsicologos() {
      try {
        const response = await api.get(`/psicologos`)
        this.psicologos = response.data
      } catch (error) {
        console.error('Error al cargar psicólogos:', error)
      }
    },

    cerrarSesion() {
      this.usuarioActual = null
      this.usuarioLogueado = null
      localStorage.removeItem('usuario')
      this.comentariosActivos = []
      this.contadorComentarios = {}
    },

    async cargarPosts() {
      this.loadingPosts = true
      try {
        const { data } = await api.get(`/citas/mias/todas`)
        this.posts = data.map(c => ({
          id: c.id,
          titulo: c.contenido.length > 60 ? c.contenido.substring(0, 60) + '...' : c.contenido,
          extracto: c.contenido,
          categoria: 'General',
          categoriaKey: 'General',
          votos: 0,
          votantes: [],
          seccion: 'reciente',
          mood: '#4A7C59',
          tiempo: new Date(c.created_at).toLocaleString(),
          autor: `Usuario ${c.usuario_id}`,
          autor_id: c.usuario_id,
          bg: '#E8F3EB',
          fg: '#4A7C59'
        }))
      } catch (error) {
        console.error('Error al cargar posts:', error)
        this.posts = []
      } finally {
        this.loadingPosts = false
      }
    },

    buscar() {
      // Filtrado ya está en computed
    },

    compartir(post) {
      const texto = `${post.titulo} — MenteSana`
      if (navigator.share) {
        navigator.share({ title: texto, text: post.extracto })
      } else {
        navigator.clipboard.writeText(window.location.origin + '/#post-' + post.id)
        alert('¡Enlace copiado al portapapeles!')
      }
    },

    async votarPost() {
      if (!this.usuarioActual) {
        this.$router.push('/registro?login=1')
        return
      }
    },

    async enviarComentario() {
      if (!this.nuevoComentario.trim() || !this.postActivo || !this.usuarioActual) return
      try {
        const { data } = await api.post(`/comentarios`, {
          contenido: this.nuevoComentario,
          comentario_id: this.postActivo.id,
        })
        this.comentariosActivos.push({
          id: data.id,
          autor: this.usuarioActual.alias,
          fecha: new Date(data.created_at).toLocaleString(),
          texto: data.contenido
        })
        this.contadorComentarios[this.postActivo.id] = this.comentariosActivos.length
        this.nuevoComentario = ''
      } catch (error) {
        console.error('Error al enviar comentario:', error)
      }
    },

    async abrirPost(post) {
      this.postActivo = post
      try {
        const { data } = await api.get(`/citas/mias/todas`)
        this.comentariosActivos = data.map(r => ({
          id: r.id,
          autor: `Usuario ${r.usuario_id}`,
          fecha: new Date(r.fecha).toLocaleString(),
          texto: r.contenido
        }))
          .filter(c => c.post_id === post.id || c.postId === post.id)
          .map(c => ({
            id: c.id || c.postId,
            autor: c.autor || 'Usuario',
            fecha: c.fecha || new Date().toLocaleString(),
            texto: c.texto || ''
          }))
        this.contadorComentarios[post.id] = this.comentariosActivos.length
      } catch (error) {
        console.error('Error al cargar comentarios:', error)
        this.comentariosActivos = []
      }
      this.nuevoComentario = ''
    },

    async publicar() {
      this.errorPublicar = ''
      if (!this.nuevaPublicacion.titulo.trim()) { this.errorPublicar = 'El título no puede estar vacío'; return }
      if (!this.nuevaPublicacion.extracto.trim()) { this.errorPublicar = 'Escribe algo en el contenido'; return }
      if (!this.nuevaPublicacion.categoriaKey) { this.errorPublicar = 'Selecciona una categoría'; return }
      if (!this.usuarioLogueado) { this.errorPublicar = 'Debes iniciar sesión primero'; return }

      try {
        const {data} = await api.post(`/comentarios`, {
          contenido: this.nuevaPublicacion.extracto
        })
        const nueva = {
          id: data.id,
          titulo: this.nuevaPublicacion.titulo,
          extracto: data.contenido,
          categoria: this.nuevaPublicacion.categoriaKey,
          categoriaKey: this.nuevaPublicacion.categoriaKey,
          votos: 0,
          votantes: [],
          seccion: 'reciente',
          mood: '#4A7C59',
          tiempo: new Date(data.created_at).toLocaleString(),
          autor: this.usuarioLogueado.nombre,
          autor_id: this.usuarioLogueado.id,
          bg: '#E8F3EB',
          fg: '#4A7C59'
        }

        this.posts.unshift(nueva)
        this.nuevaPublicacion = { titulo: '', extracto: '', categoriaKey: '' }
        this.modalPublicar = false
        this.seccionActual = 'reciente'
        console.log('Publicación creada:', nueva)
      } catch (error) {
        console.error('Error al publicar:', error)
        this.errorPublicar = 'No se pudo crear la publicación. Intenta de nuevo.'
      }
    },

    abrirLineas() {
      window.open('https://www.asivamosensalud.org', '_blank')
    },
  },
  mounted() {
    this.cargarPsicologos()
    this.cargarPosts()
    
    const usuarioGuardado = localStorage.getItem('usuarioActual')
    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado)
      this.usuarioActual = {
        alias: this.usuarioLogueado?.nombre || '',
      }
    }
    
    if (this.usuarioLogueado?.localidad_id) {
      this.cargarNumerosEmergencia()
    }
  }
}
</script>

<style scoped>
/* ── LAYOUT ─────────────────────────────────────── */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--cream);
  font-family: 'DM Sans', sans-serif;
}

/* ══ MODAL ══ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(44, 31, 20, 0.45);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-box {
  background: var(--cream-light);
  border-radius: 20px;
  width: 100%; max-width: 520px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(44,31,20,0.25);
}
.modal-wide { max-width: 680px; }
.modal-scroll { overflow-y: auto; flex: 1; padding: 0 24px 24px; }
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.modal-title { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--text-dark); }
.modal-close {
  width: 30px; height: 30px; border-radius: 8px; border: none;
  background: var(--cream-mid); color: var(--text-muted); cursor: pointer; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--border); }
.modal-bar { height: 4px; flex-shrink: 0; }
.modal-post-header { display: flex; gap: 14px; padding: 20px 0 12px; align-items: flex-start; }
.modal-post-titulo { font-family: 'DM Serif Display', serif; font-size: 20px; line-height: 1.3; color: var(--text-dark); margin-bottom: 8px; }
.modal-post-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.modal-post-autor { font-size: 12px; color: var(--text-faint); }
.modal-post-body { font-size: 14.5px; color: var(--text-mid); line-height: 1.7; padding-bottom: 20px; }
.modal-divider { height: 1px; background: var(--border); margin-bottom: 18px; }
.modal-comments-title { font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 14px; }
.modal-comment-form { display: flex; gap: 10px; margin-bottom: 16px; }
.comment-input-wrap { flex: 1; }
.comment-textarea {
  width: 100%; border: 1.5px solid var(--border); border-radius: 12px;
  padding: 10px 14px; font-size: 13.5px; color: var(--text-dark);
  background: var(--cream); resize: none; outline: none;
  transition: border-color 0.2s;
}
.comment-textarea:focus { border-color: var(--green-light); background: var(--cream-light); }
.comment-footer-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
.comment-hint { font-size: 11px; color: var(--text-pale); }
.btn-green-sm {
  background: var(--green); color: #FFFAF5; border: none; border-radius: 8px;
  padding: 6px 14px; font-size: 12.5px; font-weight: 500; cursor: pointer;
}
.btn-green-sm:hover { background: var(--green-dark); }
.modal-login-prompt { font-size: 13px; color: var(--text-muted); padding: 10px 0 16px; }
.link-btn { background: none; border: none; color: var(--green); font-size: 13px; cursor: pointer; font-weight: 500; text-decoration: underline; }
.empty-comments { text-align: center; color: var(--text-faint); padding: 20px; font-size: 13.5px; }
.comment-item { display: flex; gap: 10px; margin-bottom: 14px; }
.comment-bubble {
  flex: 1; background: var(--cream-mid); border-radius: 12px;
  padding: 10px 14px;
}
.comment-autor { font-size: 12px; font-weight: 500; color: var(--text-mid); margin-bottom: 4px; }
.comment-fecha { font-weight: 400; color: var(--text-pale); }
.comment-texto { font-size: 13.5px; color: var(--text-dark); line-height: 1.55; }
.anon-avatar-sm {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 500;
}

/* FORM MODAL */
.modal-no-auth { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 32px 24px; }
.modal-no-auth-icon { font-size: 36px; }
.modal-no-auth p { font-size: 14px; color: var(--text-muted); }
.modal-form { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.modal-input {
  width: 100%; border: 1.5px solid var(--border); border-radius: 12px;
  padding: 10px 14px; font-size: 14px; color: var(--text-dark);
  background: var(--cream); outline: none;
}
.modal-input:focus { border-color: var(--green-light); }
.char-count { font-size: 11px; color: var(--text-pale); text-align: right; margin-top: -8px; }
.modal-textarea {
  width: 100%; border: 1.5px solid var(--border); border-radius: 12px;
  padding: 10px 14px; font-size: 14px; color: var(--text-dark);
  background: var(--cream); resize: none; outline: none;
}
.modal-textarea:focus { border-color: var(--green-light); }
.modal-select {
  width: 100%; border: 1.5px solid var(--border); border-radius: 12px;
  padding: 10px 14px; font-size: 14px; color: var(--text-dark);
  background: var(--cream); outline: none; cursor: pointer;
}
.modal-error { font-size: 12.5px; color: #C44; background: #FEE; padding: 8px 12px; border-radius: 8px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-ghost-sm {
  background: none; border: 1.5px solid var(--border-mid); border-radius: 10px;
  padding: 7px 16px; font-size: 13px; color: var(--text-mid); cursor: pointer;
}
.btn-green {
  background: var(--green); color: #FFFAF5; border: none; border-radius: 10px;
  padding: 8px 20px; font-size: 13px; font-weight: 500; cursor: pointer;
}
.btn-green:hover { background: var(--green-dark); }

/* ══ SIDEBAR IZQUIERDO ══ */
.sidebar-left {
  width: 240px; background: var(--cream-light);
  border-right: 1px solid var(--border);
  position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0;
}
.sidebar-brand {
  display: flex; flex-direction: column; align-items: center;
  padding: 24px 16px 20px; border-bottom: 1px solid var(--border);
}
.brand-logo {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg,#6B9E78,#4A7C59);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px; box-shadow: 0 4px 12px rgba(74,124,89,0.25);
}
.brand-logo svg { width: 30px; height: 30px; }
.brand-name { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--text-dark); }
.brand-tagline { font-size: 11px; color: var(--text-faint); margin-top: 3px; text-align: center; }
.sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
.nav-section { margin-bottom: 4px; }
.section-label {
  font-size: 10px; font-weight: 500; letter-spacing: 1.1px;
  text-transform: uppercase; color: var(--text-pale); padding: 10px 10px 5px;
}
.nav-item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 8px 10px; border: none; border-radius: 10px; background: none;
  cursor: pointer; font-size: 13.5px; color: var(--text-mid);
  transition: background 0.15s; text-decoration: none; text-align: left;
}
.nav-item:hover { background: var(--cream-mid); }
.nav-item.active { background: var(--green-bg); color: #2D6040; font-weight: 500; }
.nav-user { cursor: default; font-weight: 500; color: var(--green); }
.nav-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}

/* ══ RIGHT WRAPPER ══ */
.right-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }

/* TOPBAR */
.topbar {
  background: var(--cream-light); border-bottom: 1px solid var(--border);
  height: 58px; display: flex; align-items: center; padding: 0 24px; gap: 12px;
  position: sticky; top: 0; z-index: 50;
}
.search-wrap { flex: 1; max-width: 400px; position: relative; }
.search-ico { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-faint); pointer-events: none; }
.search-input {
  width: 100%; background: var(--cream-mid); border: 1.5px solid var(--border);
  border-radius: 24px; padding: 8px 16px 8px 38px; font-size: 13.5px;
  color: var(--text-dark); outline: none; transition: border-color 0.2s;
}
.search-input::placeholder { color: var(--text-faint); }
.search-input:focus { border-color: var(--green-light); background: var(--cream-light); }
.topbar-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.btn-ghost {
  background: none; border: 1.5px solid var(--border-mid); border-radius: 20px;
  padding: 6px 13px; font-size: 13px; color: var(--text-mid); cursor: pointer;
  transition: all 0.18s; display: flex; align-items: center; gap: 6px;
  text-decoration: none;
}
.btn-ghost:hover { background: var(--cream-mid); }
.btn-green-top {
  background: var(--green); color: #FFFAF5; border: none; border-radius: 20px;
  padding: 7px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
  text-decoration: none; display: inline-block;
}
.anon-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green-light); display: inline-block; }

/* MAIN */
.main-content { padding: 24px 20px; }
.content-grid { display: flex; gap: 20px; max-width: 1140px; margin: 0 auto; align-items: flex-start; }
.posts-col { flex: 1; min-width: 0; }
.feed-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.feed-tabs {
  display: flex; background: var(--cream-light);
  border: 1px solid var(--border); border-radius: 12px; padding: 4px; gap: 2px;
}
.tab { padding: 6px 14px; border-radius: 9px; font-size: 13px; cursor: pointer; color: var(--text-muted); transition: all 0.15s; border: none; background: none; }
.tab.active { background: var(--green); color: #FFFAF5; font-weight: 500; }
.tab:not(.active):hover { background: var(--cream-mid); }
.btn-publish {
  background: var(--green); color: #FFFAF5; border: none; border-radius: 10px;
  padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}
.btn-publish:hover { background: var(--green-dark); }

/* Búsqueda */
.search-badge {
  background: var(--green-bg); border: 1px solid #C8D9CC; border-radius: 10px;
  padding: 8px 14px; font-size: 13px; color: var(--green-dark); margin-bottom: 14px;
  display: flex; align-items: center; justify-content: space-between;
}
.clear-search { background: none; border: none; color: var(--green); cursor: pointer; font-size: 14px; }

/* CARDS */
.post-card {
  background: var(--cream-light); border: 1px solid var(--border); border-radius: 16px;
  margin-bottom: 12px; overflow: hidden; cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
}
.post-card:hover { border-color: #C8D9CC; box-shadow: 0 4px 20px rgba(74,124,89,0.1); transform: translateY(-1px); }
.mood-bar { height: 3px; }
.card-inner { display: flex; }
.vote-col {
  display: flex; flex-direction: column; align-items: center; padding: 18px 12px;
  background: var(--cream); border-right: 1px solid var(--border); gap: 4px; min-width: 50px;
}
.vote-btn {
  width: 26px; height: 26px; border-radius: 7px; border: none; background: none;
  color: var(--text-pale); cursor: pointer; font-size: 13px; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.vote-btn:hover, .vote-btn.voted { background: var(--green-bg); color: var(--green); }
.vote-count { font-size: 12.5px; font-weight: 500; color: var(--text-mid); }
.card-body { flex: 1; padding: 15px 18px; min-width: 0; }
.card-meta { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; flex-wrap: wrap; }
.tag-community { font-size: 11.5px; font-weight: 500; color: var(--green); background: var(--green-bg); padding: 3px 8px; border-radius: 20px; }
.tag-category { font-size: 11px; color: #8C6A4A; background: #F0E4D4; padding: 3px 8px; border-radius: 20px; }
.card-time { font-size: 11.5px; color: var(--text-pale); margin-left: auto; }
.card-title { font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--text-dark); line-height: 1.35; margin-bottom: 7px; }
.card-excerpt { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-footer { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.card-action { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--text-faint); cursor: pointer; padding: 4px 7px; border-radius: 7px; transition: all 0.15s; }
.card-action:hover { background: var(--cream-mid); color: var(--text-mid); }
.anon-badge { display: flex; align-items: center; gap: 5px; margin-left: auto; }
.anon-avatar { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 500; }
.anon-name { font-size: 11.5px; color: var(--text-pale); }

/* ══ SIDEBAR DERECHO ══ */
.sidebar-right { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; position: sticky; top: 78px; }
.widget { background: var(--cream-light); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.widget-banner { background: linear-gradient(135deg,#4A7C59,#3A6449); padding: 20px 18px; }
.widget-banner-title { font-family: 'DM Serif Display', serif; font-size: 16px; color: #FFFAF5; margin-bottom: 8px; }
.widget-banner-desc { font-size: 13px; color: rgba(255,250,245,0.85); line-height: 1.55; margin-bottom: 14px; }
.btn-join { width: 100%; background: rgba(255,250,245,0.15); color: #FFFAF5; border: 1.5px solid rgba(255,250,245,0.4); border-radius: 10px; padding: 9px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
.btn-join:hover { background: rgba(255,250,245,0.28); }
.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
.stat-box { background: var(--cream-light); padding: 14px 16px; text-align: center; }
.stat-val { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--text-dark); }
.stat-lbl { font-size: 11px; color: var(--text-faint); margin-top: 2px; }
.widget-head { padding: 14px 18px; border-bottom: 1px solid var(--border); font-family: 'DM Serif Display', serif; font-size: 14px; color: var(--text-dark); }
.resource-item { display: flex; align-items: center; gap: 11px; padding: 11px 16px; border-bottom: 1px solid #F2EDE6; cursor: pointer; transition: background 0.15s; text-decoration: none; }
.resource-item:hover { background: var(--cream); }
.resource-ico { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.resource-name { font-size: 13px; font-weight: 500; color: var(--text-dark); }
.resource-desc { font-size: 11.5px; color: var(--text-faint); margin-top: 1px; }
.rules-wrap { padding: 12px 16px; }
.rule-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F2EDE6; font-size: 13px; color: var(--text-mid); align-items: flex-start; }
.rule-num { width: 20px; height: 20px; border-radius: 6px; background: var(--green-bg); color: var(--green); font-size: 11px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
</style>