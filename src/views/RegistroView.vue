<template>
  <div class="auth-page">
    <div class="auth-card">

      <!-- LOGO -->
      <div class="auth-brand">
        <div class="auth-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FFFAF5" stroke-width="1.7" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 11c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
            <circle cx="9.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
            <circle cx="14.5" cy="14.5" r="1.4" fill="#FFFAF5" stroke="none"/>
          </svg>
        </div>
        <div class="auth-brand-name">MenteSana</div>
        <div class="auth-brand-tagline">Tu espacio seguro y anónimo</div>
      </div>

      <!-- TABS -->
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: modo === 'registro' }" @click="modo = 'registro'">Crear cuenta</button>
        <button class="auth-tab" :class="{ active: modo === 'login' }" @click="modo = 'login'">Iniciar sesión</button>
      </div>

      <!-- REGISTRO -->
      <div v-if="modo === 'registro'" class="auth-form">
        <div class="field-group">
          <label class="field-label">Alias anónimo</label>
          <input v-model="registro.alias" class="field-input" :class="{ error: errores.alias }"
            type="text" placeholder="Ej: NieblaAzul42" maxlength="30" @input="errores.alias = ''">
          <div v-if="errores.alias" class="field-error">{{ errores.alias }}</div>
          <div class="field-hint">Tu alias es anónimo. Nadie sabrá quién eres.</div>
        </div>

        <div class="field-group">
          <label class="field-label">Correo electrónico</label>
          <input v-model="registro.email" class="field-input" :class="{ error: errores.email }"
            type="email" placeholder="tucorreo@email.com" @input="errores.email = ''">
          <div v-if="errores.email" class="field-error">{{ errores.email }}</div>
        </div>
        <div class="field-group">
          <label class="field-label">Ubicación</label>
          <input
            v-model="registro.ubicacion"
            class="field-input"
            type="text"
            placeholder="Ej: Santa Marta"
          >
        </div>
        <div class="field-group">
          <label class="field-label">Teléfono</label>

          <input
            v-model="registro.telefono"
            class="field-input"
            type="text"
            placeholder="3001234567"
          >
        </div>
        <div class="field-group">
          <label class="field-label">País</label>

          <select
              v-model="registro.localidad_id"
              class="field-input">
            <option disabled value="">Selecciona un país</option>

            <option value="1">Colombia</option>
            <option value="2">Argentina</option>
            <option value="3">México</option>
            <option value="4">España</option>
            <option value="5">Chile</option>
            <option value="6">Perú</option>
            <option value="7">Brasil</option>
            <option value="8">Estados Unidos</option>
            <option value="9">Canadá</option>
            <option value="10">Francia</option>
            <option value="11">Alemania</option>
            <option value="12">Reino Unido</option>
            <option value="13">Italia</option>
            <option value="14">Australia</option>
            <option value="15">Japón</option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">Contraseña</label>
          <div class="pass-wrap">
            <input v-model="registro.password" class="field-input" :class="{ error: errores.password }"
              :type="verPass ? 'text' : 'password'" placeholder="Mínimo 6 caracteres" @input="errores.password = ''">
            <button type="button" class="pass-toggle" @click="verPass = !verPass">{{ verPass ? '🙈' : '👁️' }}</button>
          </div>
          <div v-if="errores.password" class="field-error">{{ errores.password }}</div>
          <div class="pass-strength" v-if="registro.password">
            <div class="pass-bar">
              <div class="pass-fill" :style="{ width: fortaleza.pct + '%', background: fortaleza.color }"></div>
            </div>
            <span :style="{ color: fortaleza.color }">{{ fortaleza.label }}</span>
          </div>
        </div>

        <div v-if="errorGlobal" class="global-error">{{ errorGlobal }}</div>
        <div v-if="exito" class="global-success">{{ exito }}</div>

        <button class="btn-auth" @click="hacerRegistro">Crear mi cuenta</button>

        <div class="auth-footer">
          ¿Ya tienes cuenta?
          <button class="link-btn" @click="modo = 'login'">Inicia sesión</button>
        </div>
      </div>

      <!-- LOGIN -->
      <div v-if="modo === 'login'" class="auth-form">
        <div class="field-group">
          <label class="field-label">Tu alias</label>
          <input v-model="login.alias" class="field-input" :class="{ error: errores.loginAlias }"
            type="text" placeholder="TuAliasAnónimo" @input="errores.loginAlias = ''" @keyup.enter="hacerLogin">
          <div v-if="errores.loginAlias" class="field-error">{{ errores.loginAlias }}</div>
        </div>

        <div class="field-group">
          <label class="field-label">Contraseña</label>
          <div class="pass-wrap">
            <input v-model="login.password" class="field-input" :class="{ error: errores.loginPassword }"
              :type="verPass ? 'text' : 'password'" placeholder="••••••" @input="errores.loginPassword = ''" @keyup.enter="hacerLogin">
            <button type="button" class="pass-toggle" @click="verPass = !verPass">{{ verPass ? '🙈' : '👁️' }}</button>
          </div>
          <div v-if="errores.loginPassword" class="field-error">{{ errores.loginPassword }}</div>
        </div>

        <div v-if="errorGlobal" class="global-error">{{ errorGlobal }}</div>
        <div v-if="exito" class="global-success">{{ exito }}</div>

        <button class="btn-auth" @click="hacerLogin">Entrar</button>

        <div class="auth-footer">
          ¿No tienes cuenta?
          <button class="link-btn" @click="modo = 'registro'">Regístrate gratis</button>
        </div>
      </div>

      <div class="auth-back">
        <router-link to="/" class="link-btn">← Volver al inicio</router-link>
      </div>
    </div>

    <!-- PANEL INFORMATIVO -->
    <div class="auth-info">
      <div class="info-content">
        <div class="info-icon">🛡️</div>
        <h2 class="info-title">Un espacio donde importas</h2>
        <p class="info-desc">MenteSana es una comunidad de apoyo anónimo para personas que atraviesan momentos difíciles. Aquí puedes hablar libremente sin miedo al juicio.</p>
        <div class="info-features">
          <div class="info-feature">
            <span class="feat-icon">🔒</span>
            <div>
              <div class="feat-title">100% anónimo</div>
              <div class="feat-desc">Tu identidad real nunca es visible</div>
            </div>
          </div>
          <div class="info-feature">
            <span class="feat-icon">💬</span>
            <div>
              <div class="feat-title">Comunidad empática</div>
              <div class="feat-desc">Personas que entienden lo que sientes</div>
            </div>
          </div>
          <div class="info-feature">
            <span class="feat-icon">🧠</span>
            <div>
              <div class="feat-title">Psicólogos disponibles</div>
              <div class="feat-desc">Directorio de especialistas de Colombia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegistroView',
  data() {
    return {
      modo: 'registro',
      verPass: false,
      registro: {  alias: '',email: '',password: '',ubicacion: '',telefono: '',localidad_id: ''},
      login: { alias: '', password: '' },
      errores: {},
      errorGlobal: '',
      exito: '',
    }
  },
  computed: {
    fortaleza() {
      const p = this.registro.password
      if (!p) return { pct: 0, label: '', color: '' }
      if (p.length < 4) return { pct: 25, label: 'Muy débil', color: '#E24B4A' }
      if (p.length < 6) return { pct: 50, label: 'Débil', color: '#EF9F27' }
      if (p.length < 10) return { pct: 75, label: 'Aceptable', color: '#639922' }
      return { pct: 100, label: 'Fuerte', color: '#4A7C59' }
    }
  },
  methods: {
    async hacerRegistro() {
      this.errorGlobal = '';
      this.exito = '';
      this.errores = {}

      if (!this.registro.alias) { this.errores.alias = 'Escribe un alias'; return }
      if (!this.registro.email) { this.errores.email = 'Escribe tu correo'; return }
      if (!this.registro.password) { this.errores.password = 'Escribe una contraseña'; return }

      try {
        const nuevoUsuario = {
          nombre: this.registro.alias,
          correo: this.registro.email,
          contraseña: this.registro.password,
          ubicacion: this.registro.ubicacion,
          localidad_id: Number(this.registro.localidad_id),
          telefono: this.registro.telefono
        };

        await axios.post(
          'https://proyecto-api-6s1y.onrender.com/usuarios',
          nuevoUsuario
        );

        this.exito = '¡Cuenta creada correctamente!';

        setTimeout(() => {
          this.modo = 'login';
        }, 1200);

      } catch (error) {

        console.error(error);

        this.errorGlobal =
          error.response?.data?.detail ||
          'No se pudo crear la cuenta.';
  }
    },
    async hacerLogin() {

      try {

        const response = await axios.post(
          'https://proyecto-api-6s1y.onrender.com/login',
          {
            nombre: this.login.alias,
            contrasena: this.login.password
          }
        );

        localStorage.setItem(
          'usuario',
          JSON.stringify(response.data)
        );

        this.$router.push('/');

      } catch (error) {
        this.errorGlobal =
          error.response?.data?.detail ||
          'Credenciales incorrectas';
      }
    }
  },
      mounted() {
        
      if (this.$route.query.login) {
        this.modo = 'login'
      }

      if (localStorage.getItem('usuario')) {
        this.$router.push('/')
      }
    }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
}

.auth-card {
  width: 460px;
  min-height: 100vh;
  background: var(--cream-light);
  border-right: 1px solid var(--border);
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.auth-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.auth-logo {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg,#6B9E78,#4A7C59);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(74,124,89,0.25);
  margin-bottom: 10px;
}
.auth-logo svg { width: 28px; height: 28px; }
.auth-brand-name { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--text-dark); }
.auth-brand-tagline { font-size: 12px; color: var(--text-faint); margin-top: 3px; }

.auth-tabs {
  display: flex;
  background: var(--cream-mid);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
  margin-bottom: 28px;
}
.auth-tab {
  flex: 1; padding: 9px; border-radius: 9px; border: none;
  background: none; font-size: 14px; cursor: pointer; color: var(--text-muted);
  transition: all 0.15s;
}
.auth-tab.active { background: var(--cream-light); color: var(--text-dark); font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

.auth-form { display: flex; flex-direction: column; gap: 16px; }

.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 13px; font-weight: 500; color: var(--text-mid); }
.field-input {
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text-dark);
  background: var(--cream);
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.field-input:focus { border-color: var(--green-light); background: var(--cream-light); }
.field-input.error { border-color: #E24B4A; }
.field-error { font-size: 12px; color: #C44; }
.field-hint { font-size: 11.5px; color: var(--text-pale); }

.pass-wrap { position: relative; }
.pass-wrap .field-input { padding-right: 44px; }
.pass-toggle {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 16px;
}

.pass-strength { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.pass-bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.pass-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.pass-strength span { font-size: 12px; font-weight: 500; }

.global-error {
  background: #FEE; border: 1px solid #F09595; border-radius: 10px;
  padding: 10px 14px; font-size: 13px; color: #A32D2D;
}
.global-success {
  background: var(--green-bg); border: 1px solid #C8D9CC; border-radius: 10px;
  padding: 10px 14px; font-size: 13px; color: var(--green-dark);
}

.btn-auth {
  background: var(--green); color: #FFFAF5; border: none; border-radius: 12px;
  padding: 12px; font-size: 14.5px; font-weight: 500; cursor: pointer;
  transition: background 0.18s; margin-top: 4px;
}
.btn-auth:hover { background: var(--green-dark); }

.auth-footer { text-align: center; font-size: 13px; color: var(--text-faint); }
.link-btn { background: none; border: none; color: var(--green); font-size: 13px; cursor: pointer; font-weight: 500; text-decoration: underline; }
.auth-back { margin-top: auto; padding-top: 24px; text-align: center; }

/* PANEL DERECHO */
.auth-info {
  flex: 1;
  background: linear-gradient(135deg, #3A6449 0%, #2C4D38 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}
.info-content { max-width: 400px; }
.info-icon { font-size: 48px; margin-bottom: 20px; }
.info-title {
  font-family: 'DM Serif Display', serif;
  font-size: 30px; color: #FFFAF5; line-height: 1.25; margin-bottom: 16px;
}
.info-desc { font-size: 15px; color: rgba(255,250,245,0.8); line-height: 1.65; margin-bottom: 32px; }
.info-features { display: flex; flex-direction: column; gap: 18px; }
.info-feature { display: flex; gap: 14px; align-items: flex-start; }
.feat-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
.feat-title { font-size: 14px; font-weight: 500; color: #FFFAF5; margin-bottom: 2px; }
.feat-desc { font-size: 13px; color: rgba(255,250,245,0.7); }

@media (max-width: 768px) {
  .auth-info { display: none; }
  .auth-card { width: 100%; }
}
</style>