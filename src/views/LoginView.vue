<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="h-16 w-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
        <span class="text-3xl text-white">🎓</span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Control Escolar
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingresa con tu correo institucional
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="procesarLogin">
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Correo electrónico </label>
            <div class="mt-1">
              <input v-model="email" id="email" type="email" required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
            <div class="mt-1">
              <input v-model="password" id="password" type="password" required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div v-if="authStore.errorMsg" class="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            ⚠️ {{ authStore.errorMsg }}
          </div>

          <div>
            <button type="submit" :disabled="authStore.cargando"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
              <span v-if="authStore.cargando">Iniciando sesión...</span>
              <span v-else>Entrar al sistema</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function procesarLogin() {
  const exito = await authStore.iniciarSesion(email.value, password.value)
  if (exito) {
    // Si el login es correcto, lo mandamos al dashboard
    router.push('/')
  }
}
</script>