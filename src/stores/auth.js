import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const cargando = ref(false)
  const errorMsg = ref('')

  // Función para iniciar sesión
  async function iniciarSesion(email, password) {
    cargando.value = true
    errorMsg.value = ''
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) throw error
      usuario.value = data.user
      return true // Login exitoso
    } catch (error) {
      errorMsg.value = error.message === 'Invalid login credentials' 
        ? 'Correo o contraseña incorrectos' 
        : error.message
      return false // Falló el login
    } finally {
      cargando.value = false
    }
  }

  // Función para cerrar sesión
  async function cerrarSesion() {
    await supabase.auth.signOut()
    usuario.value = null
  }

  return { usuario, cargando, errorMsg, iniciarSesion, cerrarSesion }
})