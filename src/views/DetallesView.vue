<template>
  <div class="det-page">

    <header class="det-topbar">
      <button class="back-link" @click="$router.back()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Volver
      </button>
      <router-link to="/" class="det-brand">MenteSana</router-link>
    </header>

    <div v-if="loading" class="det-state">Cargando perfil...</div>
    <div v-if="!loading && !psicologo" class="det-state error">Psicólogo no encontrado.</div>

    <!-- MODAL CITA -->
    <div v-if="modalCita" class="modal-overlay" @click.self="modalCita = false">
      <div class="modal-cita">
        <div class="modal-head">
          <span class="modal-title">Agendar cita con {{ psicologo?.nombre }}</span>
          <button class="modal-close" @click="modalCita = false">✕</button>
        </div>
        <div class="modal-cita-body" v-if="!citaEnviada">
          <div class="field-group">
            <label class="field-label">Tu nombre (o alias)</label>
            <input v-model="cita.nombre_paciente" class="field-input" placeholder="Cómo quieres que te llamen...">
          </div>
          <div class="field-group">
            <label class="field-label">Correo de contacto</label>
            <input v-model="cita.correo" class="field-input" type="email" placeholder="tu@correo.com">
          </div>
          <div class="field-group">
            <label class="field-label">Fecha preferida</label>
            <input v-model="cita.fecha" class="field-input" type="date" :min="hoy">
          </div>
          <div class="field-group">
              <label class="field-label">Hora preferida</label>
              <input
                v-model="cita.hora"
                class="field-input"
                type="time"
              >
            </div>
          <div class="field-group">
            <label class="field-label">Motivo de consulta (opcional)</label>
            <textarea v-model="cita.motivo" class="field-textarea" rows="3" placeholder="Cuéntanos brevemente qué te trae..."></textarea>
          </div>
          <div v-if="errorCita" class="modal-error">{{ errorCita }}</div>
          <div class="modal-actions">
            <button class="btn-ghost-sm" @click="modalCita = false">Cancelar</button>
            <button class="btn-green" @click="enviarCita">Confirmar solicitud</button>
          </div>
        </div>
        <div v-else class="cita-exito">
          <div class="cita-exito-ico">✅</div>
          <div class="cita-exito-title">¡Solicitud enviada!</div>
          <p>{{ psicologo.nombre }} recibirá tu solicitud en <strong>{{ cita.correo }}</strong>. Te contactarán pronto.</p>
          <button class="btn-green" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>

    <div v-if="psicologo" class="det-layout">

      <!-- CARD PERFIL -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-ring">
            <img :src="psicologo.imagen || 'https://ui-avatars.com/api/?name=' + psicologo.nombre" :alt="psicologo.nombre">
          </div>
          <h1 class="profile-nombre">{{ psicologo.nombre }}</h1>
          <div class="profile-badge">Especialista en Salud Mental</div>
          <div class="profile-disponible">● Disponible para consultas</div>
        </div>

        <div class="profile-body">
          <div class="info-row">
            <div class="info-ico">📝</div>
            <div>
              <div class="info-label">Especialidad</div>
              <div class="info-value">{{ psicologo.descripcion }}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-ico">📍</div>
            <div>
              <div class="info-label">Ubicación</div>
              <div class="info-value">{{ psicologo.ubicacion }}, Colombia</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-ico">✉️</div>
            <div>
              <div class="info-label">Correo de contacto</div>
              <a :href="`mailto:${psicologo.correo}`" class="info-link">{{ psicologo.correo }}</a>
            </div>
          </div>
          <div class="info-row" style="border-bottom:none;">
            <div class="info-ico">🕐</div>
            <div>
              <div class="info-label">Disponibilidad</div>
              <div class="info-value">Lunes a Viernes, 8am – 6pm</div>
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn-back-sm" @click="$router.back()">← Volver</button>
          <button class="btn-agendar" @click="modalCita = true">Agendar Cita</button>
          <a :href="`mailto:${psicologo.correo}`" class="btn-correo">✉️ Escribir</a>
        </div>
      </div>

      <!-- SIDEBAR INFO -->
      <div class="det-sidebar">
        <div class="det-widget">
          <div class="det-widget-title">¿Por qué buscar ayuda?</div>
          <p class="det-widget-text">Hablar con un profesional no significa que estés "loco/a". Significa que te importas lo suficiente para buscar apoyo. Dar ese paso es un acto de valentía.</p>
        </div>

        <div class="det-widget">
          <div class="det-widget-title">Otros psicólogos</div>
          <div v-for="otro in otrosPsicologos" :key="otro.id" class="otro-item">
            <img :src="otro.imagen" :alt="otro.nombre" class="otro-avatar">
            <div class="otro-info">
              <div class="otro-nombre">{{ otro.nombre }}</div>
              <div class="otro-esp">{{ otro.descripcion }}</div>
            </div>
            <router-link :to="`/psicologos/${otro.id}`" class="otro-btn">Ver</router-link>
          </div>
        </div>

        <div class="det-widget crisis-widget">
          <div class="crisis-title">🆘 ¿En crisis ahora?</div>
          <p class="crisis-text">Llama a la línea de salud mental gratuita</p>
          <div class="crisis-num">106</div>
          <div class="crisis-sub">Disponible 24/7 en Colombia</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// import api from '../api.js';
import api from '../api.js'
//import { mensajeError } from '../api.js'

export default {
  name: 'DetallesView',

  data() {
    return {
      psicologo: null,
      otrosPsicologos: [],
      loading: true,
      modalCita: false,
      citaEnviada: false,
      errorCita: '',
      cita: {
        nombre_paciente: '',
        correo: '',
        fecha: '',
        hora: '',
        motivo: ''
      },
    }
  },
  computed: {
    hoy() {
      return new Date().toISOString().split('T')[0];
    }
  },

  async created() {
    await this.fetchPsicologo();
    await this.fetchOtrosPsicologos();
  },

  methods: {
    async fetchPsicologo() {
      try {
        this.loading = true;
        const id = this.$route.params.id
        const { data } = await api.get(`/psicologos/${id}`)
        this.psicologo = data
        const { data: locs } = await api.get('/Localidades')
        this.psicologo.ubicacion = locs.find(l => l.id === data.localidad_id)?.nombre || ''
      } catch (error) {
        console.error('Error al cargar el psicólogo:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOtrosPsicologos() {
      if (!this.psicologo) return;
      try {
        const { data } = await api.get('/psicologos');
        this.otrosPsicologos = data.filter(p => p.id !== this.psicologo.id).slice(0, 5);
      } catch (error) {
        console.error('Error al cargar otros psicólogos:', error);
      }
    },
    async enviarCita() {
        this.errorCita = '';

        if (!localStorage.getItem('usuario_id')) {
          this.$router.push({ name: 'Login' });
          return;
        }
        if (!this.cita.fecha || !this.cita.hora) {
          this.errorCita = 'Por favor completa la fecha y la hora.'
          return
        }

        try {
          await api.post('/citas', {
            psicologo_id: this.psicologo.id,
            date: this.cita.fecha,
            hour: `${this.cita.hora}:00`,
            description: this.cita.motivo || null
          })
          this.citaEnviada = true;
        } catch (error) {
            this.modalCita = false
            this.citaEnviada = false
            this.cita = { fecha: '', hora: '', motivo: '' }
            this.errorCita = ''
          }
        },

    cerrarModal() {
      this.modalCita = false;
      this.citaEnviada = false;
      this.cita = { nombre: '', correo: '', fecha: '', motivo: '' };
      this.errorCita = '';
    },

  }
}
</script>

<style scoped>
.det-page { min-height: 100vh; background: var(--cream); font-family: 'DM Sans', sans-serif; }

.det-topbar {
  background: var(--cream-light); border-bottom: 1px solid var(--border);
  height: 56px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; position: sticky; top: 0; z-index: 50;
}
.back-link {
  display: flex; align-items: center; gap: 6px;
  background: none; border: none; font-size: 13.5px; color: var(--text-mid);
  cursor: pointer; transition: color 0.15s;
}
.back-link:hover { color: var(--green); }
.det-brand { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--text-dark); text-decoration: none; }
.det-state { text-align: center; padding: 60px; color: var(--text-faint); font-size: 15px; }
.det-state.error { color: #C44; }

/* LAYOUT */
.det-layout { display: flex; gap: 24px; max-width: 1000px; margin: 40px auto; padding: 0 24px; align-items: flex-start; }

/* CARD PERFIL */
.profile-card {
  flex: 1; background: var(--cream-light); border: 1px solid var(--border);
  border-radius: 20px; overflow: hidden;
}
.profile-header {
  background: linear-gradient(135deg,#4A7C59,#3A6449);
  padding: 36px 28px 28px; text-align: center; color: #FFFAF5;
}
.avatar-ring {
  width: 110px; height: 110px; border-radius: 50%;
  border: 4px solid rgba(255,250,245,0.7); overflow: hidden;
  margin: 0 auto 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.profile-nombre { font-family: 'DM Serif Display', serif; font-size: 24px; color: #FFFAF5; margin-bottom: 8px; }
.profile-badge {
  display: inline-block; background: rgba(255,250,245,0.18);
  padding: 4px 14px; border-radius: 20px; font-size: 12.5px; margin-bottom: 8px;
}
.profile-disponible { font-size: 12px; color: rgba(255,250,245,0.8); }

.profile-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 0; }
.info-row {
  display: flex; gap: 14px; padding: 14px 0;
  border-bottom: 1px solid var(--border); align-items: flex-start;
}
.info-ico { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
.info-label { font-size: 11px; font-weight: 500; color: var(--green); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
.info-value { font-size: 14px; color: var(--text-dark); }
.info-link { font-size: 14px; color: var(--green); text-decoration: none; }
.info-link:hover { text-decoration: underline; }

.profile-actions { display: flex; gap: 10px; padding: 20px 24px; }
.btn-back-sm { flex: 1; padding: 10px; border: 1.5px solid var(--border-mid); background: none; border-radius: 12px; font-size: 13.5px; color: var(--text-mid); cursor: pointer; }
.btn-back-sm:hover { border-color: var(--green); color: var(--green); }
.btn-agendar { flex: 2; background: var(--green); color: #FFFAF5; border: none; border-radius: 12px; padding: 10px; font-size: 13.5px; font-weight: 500; cursor: pointer; }
.btn-agendar:hover { background: var(--green-dark); }
.btn-correo { flex: 1; background: var(--green-bg); color: var(--green-dark); border: none; border-radius: 12px; padding: 10px; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: none; text-align: center; }

/* SIDEBAR */
.det-sidebar { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; }
.det-widget { background: var(--cream-light); border: 1px solid var(--border); border-radius: 16px; padding: 18px; }
.det-widget-title { font-family: 'DM Serif Display', serif; font-size: 15px; color: var(--text-dark); margin-bottom: 10px; }
.det-widget-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; font-style: italic; }

.otro-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); }
.otro-item:last-child { border-bottom: none; }
.otro-avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.otro-info { flex: 1; min-width: 0; }
.otro-nombre { font-size: 13px; font-weight: 500; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.otro-esp { font-size: 11.5px; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.otro-btn { background: var(--green-bg); color: var(--green-dark); border: none; border-radius: 8px; padding: 5px 12px; font-size: 12px; font-weight: 500; cursor: pointer; text-decoration: none; flex-shrink: 0; }
.otro-btn:hover { background: #C8D9CC; }

.crisis-widget { background: #FEF5F5; border-color: #F09595; }
.crisis-title { font-size: 14px; font-weight: 500; color: #A32D2D; margin-bottom: 6px; }
.crisis-text { font-size: 13px; color: #7A2020; margin-bottom: 8px; }
.crisis-num { font-family: 'DM Serif Display', serif; font-size: 36px; color: #A32D2D; line-height: 1; }
.crisis-sub { font-size: 11.5px; color: #C44; margin-top: 4px; }

/* MODAL CITA */
.modal-overlay { position: fixed; inset: 0; background: rgba(44,31,20,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-cita { background: var(--cream-light); border-radius: 20px; width: 100%; max-width: 480px; overflow: hidden; box-shadow: 0 20px 60px rgba(44,31,20,0.25); }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid var(--border); }
.modal-title { font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--text-dark); }
.modal-close { width: 30px; height: 30px; border-radius: 8px; border: none; background: var(--cream-mid); color: var(--text-muted); cursor: pointer; font-size: 13px; }
.modal-cita-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 13px; font-weight: 500; color: var(--text-mid); }
.field-input { border: 1.5px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 14px; color: var(--text-dark); background: var(--cream); outline: none; }
.field-input:focus { border-color: var(--green-light); }
.field-textarea { border: 1.5px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 14px; color: var(--text-dark); background: var(--cream); outline: none; resize: none; font-family: 'DM Sans', sans-serif; }
.modal-error { font-size: 12.5px; color: #C44; background: #FEE; padding: 8px 12px; border-radius: 8px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-ghost-sm { background: none; border: 1.5px solid var(--border-mid); border-radius: 10px; padding: 8px 16px; font-size: 13px; color: var(--text-mid); cursor: pointer; }
.btn-green { background: var(--green); color: #FFFAF5; border: none; border-radius: 10px; padding: 9px 20px; font-size: 13.5px; font-weight: 500; cursor: pointer; }
.btn-green:hover { background: var(--green-dark); }

.cita-exito { padding: 36px 28px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.cita-exito-ico { font-size: 44px; }
.cita-exito-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--green); }
.cita-exito p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }
</style>