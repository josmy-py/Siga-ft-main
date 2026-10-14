<script setup>
import { computed, onMounted, ref } from "vue";
import { asignacionService } from "../../services/asignacionService";

// M4 (D-A5): secciones donde el docente en sesión imparte materias en el año activo.
const carga = ref(null);
const cargando = ref(true);
const error = ref("");

const gradosSecciones = computed(() =>
  (carga.value?.secciones ?? []).map((s) => ({
    id: s.seccion?.id,
    grado: s.seccion?.grado?.nombre ?? "",
    seccion: s.seccion?.nombre ?? "",
    turno: s.seccion?.turno ?? "",
    estudiantes: s.seccion?.matriculados ?? 0,
    plan: s.plan?.nombre ?? "",
    materias: s.materias.map((m) => m.nombre),
    guia: s.seccion?.profesor_id === carga.value?.profesor?.id,
  }))
);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    carga.value = await asignacionService.miCarga();
  } catch (e) {
    error.value = e.response?.data?.message ?? "No se pudieron cargar tus grados y secciones.";
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Grados y Secciones Asignados</h2>
          <p class="text-sm text-gray-500">
            Información de grados a cargo del docente<span v-if="carga?.anio_lectivo">
              - Año lectivo {{ carga.anio_lectivo.nombre }}</span
            >
          </p>
        </section>

        <p v-if="cargando" class="text-sm text-gray-500">
          <i class="pi pi-spin pi-spinner mr-2"></i>Cargando secciones...
        </p>
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {{ error }}
          <button class="ml-3 underline" @click="cargar">Reintentar</button>
        </div>
        <div
          v-else-if="!carga?.anio_lectivo"
          class="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500"
        >
          No hay un año lectivo activo.
        </div>
        <div
          v-else-if="!gradosSecciones.length"
          class="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-500"
        >
          Aún no tienes secciones asignadas en este año lectivo.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="item in gradosSecciones"
            :key="item.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-book text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-800 text-lg">
                  {{ item.grado }} - Sección {{ item.seccion }}
                </h3>
                <p class="text-sm text-gray-500">
                  Grado Escolar<span v-if="item.guia"> · Docente guía</span>
                </p>
              </div>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Estudiantes:</span>
                <span class="font-medium text-gray-800">{{ item.estudiantes }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Turno:</span>
                <span class="font-medium text-gray-800 capitalize">{{ item.turno }}</span>
              </div>
              <div v-if="item.plan" class="flex items-center justify-between">
                <span class="text-gray-500">Plan de estudios:</span>
                <span class="font-medium text-gray-800 text-right">{{ item.plan }}</span>
              </div>
              <div class="flex items-start justify-between gap-4">
                <span class="text-gray-500">Asignaturas ({{ item.materias.length }}):</span>
                <span class="font-medium text-gray-800 text-right">{{ item.materias.join(", ") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
