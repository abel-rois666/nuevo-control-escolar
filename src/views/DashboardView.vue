<template>
  <div class="min-h-screen bg-gray-100 p-8">
    
    <div class="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🎓</span>
        <div>
          <h2 class="text-xl font-bold text-gray-800">Universidad CUOM</h2>
          <p class="text-sm text-gray-500">Bienvenido, {{ usuarioActual?.email }}</p>
        </div>
      </div>
      <button @click="cerrarSesion" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
        Cerrar Sesión
      </button>
    </div>

    <div v-if="cargandoInicial" class="text-center mt-20 text-gray-500 animate-pulse font-medium">
      Cargando plataforma...
    </div>

    <div v-else>
      <div v-if="esAdmin && !alumno360" class="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-600">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Buscador de Alumnos</h1>
        <div class="flex gap-4 mb-6">
          <input v-model="textoBusqueda" @keyup.enter="buscarAlumnos" type="text" placeholder="Buscar..." class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <button @click="buscarAlumnos" :disabled="cargandoBusqueda" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {{ cargandoBusqueda ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
        <div v-if="resultados.length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-600 text-sm uppercase"><th class="p-4">Matrícula</th><th class="p-4">Nombre</th><th class="p-4 text-center">Acción</th></tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="alum in resultados" :key="alum.id" class="hover:bg-gray-50">
                <td class="p-4 font-bold text-indigo-600">{{ alum.matricula }}</td>
                <td class="p-4">{{ alum.nombre }} {{ alum.primer_apellido }} {{ alum.segundo_apellido || '' }}</td>
                <td class="p-4 text-center"><button @click="verExpediente(alum.id)" class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold">Ver Expediente</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="alumno360" class="max-w-7xl mx-auto space-y-6">
        <button v-if="esAdmin" @click="cerrarExpediente" class="mb-2 flex items-center text-indigo-600 hover:text-indigo-800 font-bold">← Volver al buscador</button>
        
        <div class="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center border-l-4 border-indigo-600">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 uppercase">{{ alumno360.nombre }} {{ alumno360.primer_apellido }} {{ alumno360.segundo_apellido || '' }}</h1>
            <p class="text-gray-500 font-medium mt-1">Matrícula: <span class="font-bold text-gray-800">{{ alumno360.matricula }}</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <h2 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">💰 Estado de Cuenta</h2>
            <div v-if="alumno360.cuentas_por_cobrar?.length > 0" class="space-y-3">
              <div v-for="cuenta in alumno360.cuentas_por_cobrar" :key="cuenta.id" class="p-4 rounded-lg border flex justify-between items-center" :class="cuenta.estatus === 'PAGADO' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'">
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ cuenta.conceptos_cobro?.descripcion || 'Concepto General' }}</p>
                  <p class="text-xs font-semibold mt-1" :class="cuenta.estatus === 'PAGADO' ? 'text-green-600' : 'text-red-600'">{{ cuenta.estatus }}</p>
                </div>
                <p class="font-black text-lg" :class="cuenta.estatus === 'PAGADO' ? 'text-green-700' : 'text-red-700'">${{ cuenta.saldo_pendiente }}</p>
              </div>
            </div>
            <div v-else class="text-center p-6 bg-gray-50 rounded-lg text-gray-500">Sin adeudos registrados.</div>
          </div>

          <div class="lg:col-span-3 space-y-6">
            
            <div v-if="Object.keys(kardexAgrupado).length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 border border-dashed">
              No hay calificaciones registradas en el historial.
            </div>

            <div v-for="(materias, planNombre) in kardexAgrupado" :key="planNombre" class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div class="bg-slate-800 px-6 py-4 flex justify-between items-center">
                <h2 class="text-lg font-bold text-white flex items-center">
                  <span class="mr-2">📚</span> {{ planNombre }}
                </h2>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                      <th class="p-3 font-bold border-b">Materia</th>
                      <th class="p-3 text-center font-bold border-b">Parcial 1</th>
                      <th class="p-3 text-center font-bold border-b">Parcial 2</th>
                      <th class="p-3 text-center font-bold border-b">Parcial 3</th>
                      <th class="p-3 text-center font-bold border-b bg-indigo-50">Promedio</th>
                      <th class="p-3 text-center font-bold border-b">Cal. Final</th>
                      <th class="p-3 text-center font-bold border-b">Estatus</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="materia in materias" :key="materia.id" class="hover:bg-gray-50">
                      
                      <td class="p-3 font-semibold text-gray-700 text-sm">
                        {{ materia.nombre }}
                        <span v-if="materia.tipo_examen !== 'ORDINARIO' && materia.tipo_examen" class="block text-[10px] text-gray-400 mt-1 uppercase">
                          ({{ materia.tipo_examen }})
                        </span>
                      </td>
                      
                      <td class="p-3 text-center text-sm font-medium text-gray-600">{{ materia.parcial_1 }}</td>
                      <td class="p-3 text-center text-sm font-medium text-gray-600">{{ materia.parcial_2 }}</td>
                      <td class="p-3 text-center text-sm font-medium text-gray-600">{{ materia.parcial_3 }}</td>
                      
                      <td class="p-3 text-center bg-indigo-50">
                        <span class="font-bold text-indigo-700">
                          {{ calcularPromedio(materia.parcial_1, materia.parcial_2, materia.parcial_3) }}
                        </span>
                      </td>

                      <td class="p-3 text-center">
                        <span v-if="materia.calificacion_final !== '-'" class="px-3 py-1 rounded-md text-sm font-black"
                              :class="Number(materia.calificacion_final) >= 6 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                          {{ materia.calificacion_final }}
                        </span>
                        <span v-else class="text-gray-400 font-bold">-</span>
                      </td>

                      <td class="p-3 text-center">
                        <span v-if="materia.calificacion_final !== '-'" class="px-2 py-1 text-xs font-bold rounded" 
                              :class="materia.aprobado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                          {{ materia.aprobado ? 'APROBADA' : 'REPROBADA' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const usuarioActual = ref(null)
const esAdmin = ref(false)
const cargandoInicial = ref(true)

const textoBusqueda = ref('')
const resultados = ref([])
const cargandoBusqueda = ref(false)
const busquedaRealizada = ref(false)

const alumno360 = ref(null)

// ========================================================
// 1. EL "PIVOTE" MÁGICO DE FILAS A COLUMNAS
// ========================================================
const kardexAgrupado = computed(() => {
  if (!alumno360.value?.kardex) return {}
  
  const planes = {}

  alumno360.value.kardex.forEach(fila => {
    // Definir Carrera y Materia
    const plan = fila.asignaturas?.planes_estudio?.nombre || 'Plan de Estudios Desconocido'
    const materiaNombre = fila.asignaturas?.nombre || 'Materia sin asignar'
    
    // 1. Si no existe el plan de estudios en nuestro objeto, lo creamos
    if (!planes[plan]) {
      planes[plan] = {}
    }

    // 2. Si es la primera vez que vemos esta materia, creamos la "fila horizontal" base
    if (!planes[plan][materiaNombre]) {
      planes[plan][materiaNombre] = {
        id: fila.asignaturas?.id || fila.id, // Llave única
        nombre: materiaNombre,
        parcial_1: '-',
        parcial_2: '-',
        parcial_3: '-',
        calificacion_final: '-',
        aprobado: false,
        tipo_examen: ''
      }
    }

    const materiaUnificada = planes[plan][materiaNombre]
    const tipo = (fila.tipo_examen || '').toUpperCase()
    const calif = Number(fila.calificacion_final)

    // 3. Acomodar cada fila de la BD en su columna correspondiente
    if (tipo.includes('PARCIAL 1') || tipo === '1') {
      materiaUnificada.parcial_1 = calif
    } 
    else if (tipo.includes('PARCIAL 2') || tipo === '2') {
      materiaUnificada.parcial_2 = calif
    } 
    else if (tipo.includes('PARCIAL 3') || tipo === '3') {
      materiaUnificada.parcial_3 = calif
    } 
    else if (tipo.includes('ORDINARIO') || tipo.includes('FINAL') || tipo === '') {
      materiaUnificada.calificacion_final = calif
      materiaUnificada.aprobado = fila.aprobado
      materiaUnificada.tipo_examen = fila.tipo_examen
    } 
    else if (tipo.includes('EXTRA') || tipo.includes('RECURSA') || tipo.includes('TITULO')) {
      // AQUÍ ESTÁ EL TRUCO PARA EL EXTRAORDINARIO FALSO:
      // Si la calificación es 0 y además NO está aprobado, significa que nunca lo presentó.
      // Por lo tanto, IGNORAMOS ESA FILA y dejamos intacta la calificación ordinaria.
      if (calif > 0 || fila.aprobado === true) {
        materiaUnificada.calificacion_final = calif
        materiaUnificada.aprobado = fila.aprobado
        materiaUnificada.tipo_examen = fila.tipo_examen
      }
    }
  })

  // 4. Convertimos el objeto en un arreglo para que Vue lo pueda dibujar en la tabla HTML
  const resultadoFinal = {}
  for (const plan in planes) {
    resultadoFinal[plan] = Object.values(planes[plan])
  }

  return resultadoFinal
})

// ========================================================
// 2. CÁLCULO DE PROMEDIOS ESTRICTO
// ========================================================
function calcularPromedio(p1, p2, p3) {
  let suma = 0;
  let hayCalificacion = false;

  const val1 = parseFloat(p1)
  const val2 = parseFloat(p2)
  const val3 = parseFloat(p3)

  if (!isNaN(val1)) { suma += val1; hayCalificacion = true; }
  if (!isNaN(val2)) { suma += val2; hayCalificacion = true; }
  if (!isNaN(val3)) { suma += val3; hayCalificacion = true; }

  // Si no hay ningún parcial registrado, no mostramos promedio
  if (!hayCalificacion) return '-'
  
  // Dividimos estrictamente entre 3 (como en toda universidad)
  return (suma / 3).toFixed(1)
}

// ========================================================
// FUNCIONES DE BASE DE DATOS
// ========================================================
async function cerrarSesion() {
  await authStore.cerrarSesion()
  router.push('/login')
}

async function buscarAlumnos() {
  if (!textoBusqueda.value.trim()) return
  cargandoBusqueda.value = true; busquedaRealizada.value = true; resultados.value = []
  try {
    const { data, error } = await supabase.rpc('buscar_alumnos_completo', { termino: textoBusqueda.value.trim() })
    if (error) throw error
    resultados.value = data || []
  } catch (error) { console.error(error) } finally { cargandoBusqueda.value = false }
}

async function cargarExpedienteCompleto(alumnoId) {
  try {
    const { data, error } = await supabase
      .from('alumnos')
      .select(`
        id, matricula, nombre, primer_apellido, segundo_apellido,
        kardex (
          id, calificacion_final, tipo_examen, aprobado,
          asignaturas ( 
            id, nombre,
            planes_estudio ( nombre )
          )
        ),
        cuentas_por_cobrar (
          id, saldo_pendiente, estatus,
          conceptos_cobro ( descripcion )
        )
      `)
      .eq('id', alumnoId)
      .single()

    if (error) throw error
    alumno360.value = data
  } catch (error) {
    console.error("Error al cargar el 360:", error)
  }
}

async function verExpediente(alumnoId) { await cargarExpedienteCompleto(alumnoId) }
function cerrarExpediente() { alumno360.value = null }

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    usuarioActual.value = user
    esAdmin.value = user.user_metadata?.rol === 'ADMIN'
    if (!esAdmin.value) {
      const { data: perfil } = await supabase.from('alumnos').select('id').eq('auth_user_id', user.id).maybeSingle()
      if (perfil?.id) await cargarExpedienteCompleto(perfil.id)
    }
  } else {
    router.push('/login')
  }
  cargandoInicial.value = false
})
</script>