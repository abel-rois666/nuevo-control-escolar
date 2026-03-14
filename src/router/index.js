import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiereAuth: true } // Protegemos esta ruta
    }
  ]
})

// El "Cadenero" que revisa antes de cada cambio de página
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  // Si la ruta requiere auth y no hay sesión activa...
  if (to.meta.requiereAuth && !session) {
    next('/login') // Lo pateamos al login
  } 
  // Si intenta ir al login pero YA está logueado...
  else if (to.path === '/login' && session) {
    next('/') // Lo mandamos directo adentro
  } 
  else {
    next() // Pasa libremente
  }
})

export default router