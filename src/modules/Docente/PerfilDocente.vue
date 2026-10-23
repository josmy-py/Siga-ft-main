<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { asignacionService } from "@/services/asignacionService";
import { mensajeError } from "@/services/api";

// Perfil del docente con el diseño del perfil del responsable (pedido de Josmy,
// 23/10/2026). Solo lectura: los datos del profesor los administra el director.
// Datos y carga académica salen de GET docente/carga (año activo o, sin activo,
// el último año).
const authStore = useAuthStore();

const profesor = ref(null);
const anio = ref(null);
const secciones = ref([]);
const cargando = ref(true);
const error = ref("");

const fecha = (valor) => (valor ? valor.split("-").reverse().join("/") : "—");

const datos = computed(() =>
  profesor.value
    ? [
        { icono: "pi-user", etiqueta: "Nombre", valor: profesor.value.nombre },
        { icono: "pi-id-card", etiqueta: "Código", valor: profesor.value.codigo },
        { icono: "pi-credit-card", etiqueta: "DUI", valor: profesor.value.dui },
        { icono: "pi-phone", etiqueta: "Teléfono", valor: profesor.value.telefono },
        { icono: "pi-calendar", etiqueta: "Fecha de nacimiento", valor: fecha(profesor.value.fecha_nacimiento) },
        { icono: "pi-map-marker", etiqueta: "Dirección", valor: profesor.value.direccion, ancho: true },
      ]
    : [],
);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const carga = await asignacionService.miCarga();
    profesor.value = carga.profesor;
    anio.value = carga.anio_lectivo;
    secciones.value = carga.secciones ?? [];
  } catch (e) {
    error.value = mensajeError(e, "No se pudo cargar su perfil.");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const logout = () => authStore.logout();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="transition-all duration-300">
      <div class="bg-gray-100 p-6 rounded-2xl">
        <div v-if="cargando" class="p-10 text-center text-gray-500">
          <i class="pi pi-spin pi-spinner mr-2"></i>Cargando perfil...
        </div>

        <div v-else-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {{ error }} <button class="underline ml-2" @click="cargar">Reintentar</button>
        </div>

        <template v-else>
          <!-- CARD PERFIL -->
          <div class="bg-white rounded-2xl shadow p-6 mb-6">
            <div class="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2 break-all">
                  <i class="pi pi-user text-blue-600"></i>
                  {{ authStore.user?.email }}
                </h1>
                <p class="text-gray-500 text-sm mt-1">Cuenta de docente</p>
              </div>
              <button
                @click="logout"
                class="bg-red-500 border border-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
              >
                <i class="pi pi-sign-out"></i>
                Cerrar sesión
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- DATOS DEL DOCENTE -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-2xl shadow p-6">
                <div class="mb-4">
                  <h2 class="text-lg font-semibold text-gray-700">
                    <i class="pi pi-id-card mr-2 text-blue-500"></i>
                    Datos del docente
                  </h2>
                  <p class="text-xs text-gray-500 mt-1">Para corregir un dato, consulte con el director.</p>
                </div>

                <div v-if="profesor" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div v-for="d in datos" :key="d.etiqueta" class="flex items-center gap-2" :class="{ 'md:col-span-2': d.ancho }">
                    <i :class="['pi', d.icono, 'text-gray-500']"></i>
                    <span><b>{{ d.etiqueta }}:</b> {{ d.valor || "—" }}</span>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">
                  Su cuenta no tiene un perfil de profesor registrado; consulte con el director.
                </div>
              </div>
            </div>

            <!-- CARGA ACADÉMICA -->
            <div class="bg-white rounded-2xl shadow p-6">
              <h2 class="text-lg font-semibold mb-4 text-gray-700">
                <i class="pi pi-book mr-2 text-purple-500"></i>
                Carga académica {{ anio?.anio ?? "" }}
              </h2>

              <div class="space-y-4">
                <div v-for="s in secciones" :key="s.seccion.id" class="border rounded-xl p-4 bg-gray-50">
                  <p class="font-semibold text-gray-800">
                    <i class="pi pi-users mr-2"></i>
                    {{ s.seccion.grado?.nombre }} - Sección {{ s.seccion.nombre }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    <i class="pi pi-bookmark mr-2"></i>
                    {{ s.materias.map((m) => m.nombre).join(", ") }}
                  </p>
                </div>
                <p v-if="!secciones.length" class="text-sm text-gray-500">No tiene asignaturas asignadas en este año lectivo.</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
