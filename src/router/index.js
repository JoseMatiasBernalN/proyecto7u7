import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'
import PsicologosView from '../views/PsicologosView.vue'
import DetallesView from '../views/DetallesView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/registro', name: 'registro', component: RegistroView },
  { path: '/psicologos', name: 'psicologos', component: PsicologosView },
  { path: '/psicologos/:id', name: 'psicologo_id', component: DetallesView , props: true },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router