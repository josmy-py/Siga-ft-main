<script setup>
import { computed, onMounted, ref } from "vue";
import { anioLectivoService } from "@/services/calendarioService";
import { mensajeError } from "@/services/api";

const adminName = ref("Ing. Juan Pérez");

// Año lectivo activo y periodo abierto (M2.2), desde la API
const calendario = ref(null);
const cargandoCalendario = ref(true);
const errorCalendario = ref(null);

const anioActivo = computed(() => calendario.value?.anio_lectivo ?? null);
const periodoAbierto = computed(() => calendario.value?.periodo_abierto ?? null);

onMounted(async () => {
  try {
    calendario.value = await anioLectivoService.actual();
  } catch (error) {
    errorCalendario.value = mensajeError(error, "No se pudo obtener el año lectivo actual");
  } finally {
    cargandoCalendario.value = false;
  }
});
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300 bg-slate-100">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-3 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-800">Panel Administrativo</h2>
          </div>
        </div>
      </header>

      <div class="p-6">
        <!-- Título -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestión Académica</h1>

          <p class="text-gray-500 mt-1">Bienvenido, {{ adminName }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Docentes</p>
                <h2 class="text-4xl font-bold mt-2">15</h2>
                <p class="text-green-600 text-sm mt-2">Activos</p>
              </div>

              <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <i class="pi pi-user text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Grados</p>
                <h2 class="text-4xl font-bold mt-2">11</h2>
                <p class="text-blue-600 text-sm mt-2">Registrados</p>
              </div>

              <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <i class="pi pi-sitemap text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Matrículas</p>
                <h2 class="text-4xl font-bold mt-2">360</h2>
                <p class="text-cyan-600 text-sm mt-2">Aceptadas</p>
              </div>

              <div class="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
                <i class="pi pi-users text-cyan-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Reportes</p>
                <h2 class="text-4xl font-bold mt-2">4</h2>
                <p class="text-orange-600 text-sm mt-2">Pendientes</p>
              </div>

              <div class="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                <i class="pi pi-file text-orange-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Año lectivo y periodo</p>
                <template v-if="cargandoCalendario">
                  <h2 class="text-2xl font-bold mt-2 text-gray-400">Cargando...</h2>
                </template>
                <template v-else-if="errorCalendario">
                  <p class="text-red-600 text-sm mt-2">{{ errorCalendario }}</p>
                </template>
                <template v-else-if="!anioActivo">
                  <h2 class="text-2xl font-bold mt-2 text-gray-400">Sin año activo</h2>
                  <router-link to="/Admin/anios-lectivos" class="text-purple-600 text-sm mt-2 inline-block underline">
                    No hay un año lectivo activo. Configúrelo aquí.
                  </router-link>
                </template>
                <template v-else>
                  <h2 class="text-2xl font-bold mt-2">Año {{ anioActivo.nombre }}</h2>
                  <p v-if="periodoAbierto" class="text-purple-600 text-sm mt-2">{{ periodoAbierto.nombre }} abierto</p>
                  <router-link v-else to="/Admin/anios-lectivos" class="text-amber-600 text-sm mt-2 inline-block underline">
                    Ningún periodo abierto
                  </router-link>
                </template>
              </div>

              <div class="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <i class="pi pi-calendar text-purple-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-500 text-sm">Avisos</p>
                <h2 class="text-4xl font-bold mt-2">3</h2>
                <p class="text-red-600 text-sm mt-2">Sin leer</p>
              </div>

              <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <i class="pi pi-bell text-red-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6 mt-8">
          <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Resumen Académico</h2>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Gráfica -->
              <div class="flex items-end justify-center gap-6 h-56">
                <div class="flex flex-col items-center">
                  <div class="w-14 h-20 bg-cyan-400 rounded-t-lg"></div>
                  <span class="mt-2 text-sm font-medium">Parv.</span>
                  <span class="text-xs text-gray-500">40</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="w-14 h-48 bg-green-500 rounded-t-lg"></div>
                  <span class="mt-2 text-sm font-medium">Básica</span>
                  <span class="text-xs text-gray-500">214</span>
                </div>

                <div class="flex flex-col items-center">
                  <div class="w-14 h-24 bg-blue-500 rounded-t-lg"></div>
                  <span class="mt-2 text-sm font-medium">Media</span>
                  <span class="text-xs text-gray-500">106</span>
                </div>
              </div>

              <div class="space-y-6">
                <div>
                  <div class="flex justify-between mb-2">
                    <span>Parvularia</span>
                    <strong>40</strong>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-cyan-400 h-3 rounded-full" style="width: 30%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-2">
                    <span>Educación Básica</span>
                    <strong>214</strong>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-green-500 h-3 rounded-full" style="width: 80%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between mb-2">
                    <span>Educación Media</span>
                    <strong>106</strong>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div class="bg-blue-500 h-3 rounded-full" style="width: 35%"></div>
                  </div>
                </div>

                <div class="pt-4 border-t">
                  <div class="flex justify-between">
                    <span class="font-medium">Total estudiantes</span>
                    <strong>360</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Indicadores</h2>

            <div class="flex flex-wrap justify-center gap-10">
              <div class="flex flex-col items-center">
                <div class="relative w-28 h-28">
                  <svg class="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#E5E7EB" stroke-width="6" fill="none" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#7C3AED"
                      stroke-width="6"
                      fill="none"
                      stroke-linecap="round"
                      stroke-dasharray="289"
                      stroke-dashoffset="35"
                    />
                  </svg>

                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold text-purple-600">360</span>
                  </div>
                </div>

                <p class="mt-3 text-sm font-medium text-gray-700">Estudiantes</p>
              </div>

              \
              <div class="flex flex-col items-center">
                <div class="relative w-28 h-28">
                  <svg class="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#E5E7EB" stroke-width="6" fill="none" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#EF4444"
                      stroke-width="6"
                      fill="none"
                      stroke-linecap="round"
                      stroke-dasharray="289"
                      stroke-dashoffset="100"
                    />
                  </svg>

                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold text-red-500">14</span>
                  </div>
                </div>

                <p class="mt-3 text-sm font-medium text-gray-700">Docentes Activos</p>
              </div>

              <div class="flex flex-col items-center">
                <div class="relative w-28 h-28">
                  <svg class="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#E5E7EB" stroke-width="6" fill="none" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#EAB308"
                      stroke-width="6"
                      fill="none"
                      stroke-linecap="round"
                      stroke-dasharray="289"
                      stroke-dashoffset="150"
                    />
                  </svg>

                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold text-yellow-500">11</span>
                  </div>
                </div>

                <p class="mt-3 text-sm font-medium text-gray-700">Grados Habilitados</p>
              </div>

              <div class="flex flex-col items-center">
                <div class="relative w-28 h-28">
                  <svg class="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#E5E7EB" stroke-width="6" fill="none" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#1E3A8A"
                      stroke-width="6"
                      fill="none"
                      stroke-linecap="round"
                      stroke-dasharray="289"
                      stroke-dashoffset="60"
                    />
                  </svg>

                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-bold text-blue-900">{{ periodoAbierto ? `P${periodoAbierto.nivel}` : "—" }}</span>
                  </div>
                </div>

                <p class="mt-3 text-sm font-medium text-gray-700">Período Actual</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm mt-8">
          <div class="flex items-center gap-2 mb-5">
            <i class="pi pi-megaphone text-blue-600 text-xl"></i>

            <h2 class="text-xl font-semibold text-gray-800">Información Importante</h2>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex gap-4 p-4 bg-blue-50 rounded-xl">
              <i class="pi pi-users text-blue-600 text-xl mt-1"></i>

              <div>
                <h3 class="font-semibold text-gray-800">Reunión de docentes</h3>

                <p class="text-sm text-gray-500">Viernes 14 de junio - 2:00 PM</p>
              </div>
            </div>

            <div class="flex gap-4 p-4 bg-green-50 rounded-xl">
              <i class="pi pi-file-edit text-green-600 text-xl mt-1"></i>

              <div>
                <h3 class="font-semibold text-gray-800">Entrega de notas</h3>

                <p class="text-sm text-gray-500">Fecha límite: 20 de junio</p>
              </div>
            </div>

            <div class="flex gap-4 p-4 bg-purple-50 rounded-xl">
              <i class="pi pi-graduation-cap text-purple-600 text-xl mt-1"></i>

              <div>
                <h3 class="font-semibold text-gray-800">Matrículas abiertas</h3>

                <p class="text-sm text-gray-500">Cierre: 30 de junio</p>
              </div>
            </div>

            <div class="flex gap-4 p-4 bg-red-50 rounded-xl">
              <i class="pi pi-exclamation-triangle text-red-600 text-xl mt-1"></i>

              <div>
                <h3 class="font-semibold text-gray-800">Reportes pendientes</h3>

                <p class="text-sm text-gray-500">Hay 4 reportes esperando revisión.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
