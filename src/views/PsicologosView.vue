<template>
  <div class="psic-page">

    <!-- HEADER -->
    <header class="psic-topbar">
      <router-link to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        MenteSana
      </router-link>
      <div class="psic-topbar-center">
        <div class="psic-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FFFAF5" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 11c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
            <circle cx="9.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
            <circle cx="14.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
          </svg>
        </div>
        <span class="psic-nav-title">Directorio de Psicólogos</span>
      </div>
      <div style="width:120px;"></div>
    </header>

    <!-- HERO -->
    <div class="psic-hero">
      <h1 class="psic-hero-title">Encuentra tu psicólogo</h1>
      <p class="psic-hero-sub">Conecta con profesionales de salud mental en Colombia</p>
      <div class="psic-search-row">
        <div class="psic-search">
          <svg class="psic-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="busqueda" type="text" placeholder="Buscar por nombre o especialidad..." class="psic-search-input">
        </div>
        <select v-model="filtroUbicacion" class="psic-filter">
          <option value="">Todas las ciudades</option>
          <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
        </select>
      </div>
    </div>

    <!-- GRID -->
    <main class="psic-main">
      <div class="psic-results-info">
        {{ psicologosFiltrados.length }} psicólogos encontrados
      </div>

      <div v-if="psicologosFiltrados.length === 0" class="psic-empty">
        <p>No se encontraron psicólogos con ese filtro.</p>
      </div>

      <div class="psic-grid">
        <div v-for="psi in psicologosFiltrados" :key="psi.id" class="psic-card">
          <div class="psic-card-top">
            <div class="psic-avatar-ring">
              <img :src="psi.imagen" :alt="psi.nombre">
            </div>
            <div class="psic-disponible">● Disponible</div>
          </div>
          <div class="psic-card-body">
            <div class="psic-nombre">{{ psi.nombre }}</div>
            <div class="psic-especialidad">🧠 {{ psi.descripcion }}</div>
            <div class="psic-ubicacion">📍 {{ psi.ubicacion }}</div>
          </div>
          <div class="psic-card-footer">
            <router-link :to="`/psicologos/${psi.id}`" class="btn-ver-perfil">Ver perfil</router-link>
            <a :href="`mailto:${psi.correo}`" class="btn-contactar" title="Enviar correo">✉️</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PsicologosView',

  data() {
    return {
      psicologos: [],
      busqueda: '',
      filtroUbicacion: '',
      psicologosLoading: false
    }
  },

  computed: {
    ciudades() {
      return [...new Set(this.psicologos.map(p => p.ubicacion || 'Colombia'))].sort()
    },

    psicologosFiltrados() {
      const q = this.busqueda.toLowerCase()

      return this.psicologos.filter(p => {
        const matchBusqueda =
          !q ||
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)

        const matchCiudad =
          !this.filtroUbicacion ||
          (p.ubicacion || 'Colombia') === this.filtroUbicacion

        return matchBusqueda && matchCiudad
      })
    }
  },

  methods: {
    async getPsicologos() {
      try {
        this.psicologosLoading = true

        const response = await axios.get('https://proyecto-api-6s1y.onrender.com/psicologos')

        this.psicologos = response.data.map((p, index) => ({
          ...p,

          imagen:
            p.imagen ||
            `https://randomuser.me/api/portraits/${
              index % 2 === 0 ? 'women' : 'men'
            }/${10 + index}.jpg`,

          ubicacion: p.ubicacion || 'Colombia'
        }))

        console.log(this.psicologos)

      } catch (error) {
        console.error('Error obteniendo psicólogos:', error)
      } finally {
        this.psicologosLoading = false
      }
    }
  },

  mounted() {
    this.getPsicologos()
  }
}
</script>

<style scoped>
.psic-page {
  min-height: 100vh;
  background: var(--cream);
  font-family: 'DM Sans', sans-serif;
}

.psic-topbar {
  background: var(--cream-light);
  border-bottom: 1px solid var(--border);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.back-link {
  display: flex; align-items: center; gap: 6px;
  font-size: 13.5px; color: var(--text-mid); text-decoration: none;
  transition: color 0.15s;
}
.back-link:hover { color: var(--green); }

.psic-topbar-center { display: flex; align-items: center; gap: 9px; }
.psic-logo {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg,#6B9E78,#4A7C59);
  display: flex; align-items: center; justify-content: center;
}
.psic-logo svg { width: 17px; height: 17px; }
.psic-nav-title { font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--text-dark); }

/* HERO */
.psic-hero {
  background: linear-gradient(135deg,#4A7C59,#3A6449);
  padding: 52px 28px 40px;
  text-align: center;
}
.psic-hero-title {
  font-family: 'DM Serif Display', serif;
  font-size: 36px; color: #FFFAF5; margin-bottom: 10px;
}
.psic-hero-sub { font-size: 16px; color: rgba(255,250,245,0.8); margin-bottom: 28px; }

.psic-search-row {
  display: flex; gap: 12px; max-width: 700px; margin: 0 auto;
}
.psic-search { flex: 1; position: relative; }
.psic-search-ico {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--text-faint); pointer-events: none;
}
.psic-search-input {
  width: 100%; border: none; border-radius: 12px;
  padding: 12px 16px 12px 42px; font-size: 14px;
  background: rgba(255,250,245,0.95); color: var(--text-dark); outline: none;
}
.psic-filter {
  border: none; border-radius: 12px; padding: 12px 14px;
  font-size: 14px; background: rgba(255,250,245,0.95); color: var(--text-dark); outline: none; cursor: pointer;
}

/* MAIN */
.psic-main { max-width: 1200px; margin: 0 auto; padding: 28px 24px; }
.psic-results-info { font-size: 13px; color: var(--text-faint); margin-bottom: 20px; }
.psic-empty { text-align: center; padding: 48px; color: var(--text-faint); }

.psic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.psic-card {
  background: var(--cream-light);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.psic-card:hover {
  box-shadow: 0 8px 24px rgba(74,124,89,0.12);
  transform: translateY(-2px);
}

.psic-card-top {
  background: linear-gradient(135deg,#E8F3EB,#D0E8D6);
  padding: 24px 20px 16px;
  display: flex; flex-direction: column; align-items: center;
  position: relative;
}

.psic-avatar-ring {
  width: 80px; height: 80px; border-radius: 50%;
  border: 3px solid #FFFAF5;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(74,124,89,0.2);
}
.psic-avatar-ring img { width: 100%; height: 100%; object-fit: cover; }

.psic-disponible {
  position: absolute; top: 12px; right: 12px;
  font-size: 10.5px; color: var(--green-dark);
  background: #FFFAF5; padding: 3px 8px; border-radius: 20px;
  font-weight: 500;
}

.psic-card-body { padding: 14px 18px 10px; }
.psic-nombre { font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--text-dark); margin-bottom: 5px; }
.psic-especialidad { font-size: 12.5px; color: var(--text-muted); margin-bottom: 4px; }
.psic-ubicacion { font-size: 12px; color: var(--text-faint); }

.psic-card-footer {
  padding: 12px 18px 16px;
  display: flex; gap: 8px;
}
.btn-ver-perfil {
  flex: 1; background: var(--green); color: #FFFAF5;
  text-decoration: none; border-radius: 10px; padding: 8px;
  font-size: 13px; font-weight: 500; text-align: center;
  transition: background 0.15s;
}
.btn-ver-perfil:hover { background: var(--green-dark); }
.btn-contactar {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--green-bg); display: flex; align-items: center; justify-content: center;
  font-size: 16px; text-decoration: none; transition: background 0.15s;
}
.btn-contactar:hover { background: #C8D9CC; }
</style>