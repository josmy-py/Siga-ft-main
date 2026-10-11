<script setup>
import { ref } from "vue";

const emit = defineEmits(["cerrar"]);

const alumno = ref({
  nombre: "Carlos López Ramírez",
  nie: "202600154",
  correo: "carlos@email.com",
  grado: "4°",
  seccion: "B",
  turno: "Matutino",
  anio: "2026",

  encargado: {
    nombre: "María López",
    dui: "01234567-8",
    parentesco: "Madre",
    telefono: "7777-7777",
  },

  salud: {
    enfermedades: "Asma",
    discapacidades: "Ninguna",
    medicamentos: "Salbutamol",
  },
});

const tieneReportes = ref(true);

const reportes = ref([
  { titulo: "Conducta inapropiada", fecha: "2026-06-10" },
  { titulo: "Entrega tardía de tareas", fecha: "2026-05-22" },
]);
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div class="bg-[#f5f7fb] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">

      <!-- HEADER -->
      <div class="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <i class="pi pi-user text-indigo-600 text-xl"></i>
          <div>
            <h1 class="text-lg font-bold text-gray-800">Ficha del Estudiante</h1>
            <p class="text-sm text-gray-500">Panel de administración escolar</p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-xs text-gray-500">NIE</p>
          <p class="font-semibold">{{ alumno.nie }}</p>
        </div>
      </div>

      <div class="space-y-6">

        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <i class="pi pi-id-card text-indigo-600"></i>
            </div>

            <div>
              <h2 class="text-lg font-bold text-gray-800">{{ alumno.nombre }}</h2>
              <p class="text-sm text-gray-500">{{ alumno.correo }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl">
              <i class="pi pi-book text-gray-500"></i>
              <p class="font-semibold">{{ alumno.grado }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl">
              <i class="pi pi-sitemap text-gray-500"></i>
              <p class="font-semibold">{{ alumno.seccion }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl">
              <i class="pi pi-clock text-gray-500"></i>
              <p class="font-semibold">{{ alumno.turno }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl">
              <i class="pi pi-calendar text-gray-500"></i>
              <p class="font-semibold">{{ alumno.anio }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4">
            <i class="pi pi-users mr-2"></i> Encargado
          </h3>

          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-gray-500">Nombre</p>
              <p class="font-semibold">{{ alumno.encargado.nombre }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-gray-500">DUI</p>
              <p class="font-semibold">{{ alumno.encargado.dui }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-gray-500">Parentesco</p>
              <p class="font-semibold">{{ alumno.encargado.parentesco }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4">
            <i class="pi pi-heart mr-2"></i> Salud
          </h3>

          <div class="grid md:grid-cols-3 gap-4">
            <div class="p-4 bg-red-50 rounded-xl">
              <p>{{ alumno.salud.enfermedades }}</p>
            </div>

            <div class="p-4 bg-yellow-50 rounded-xl">
              <p>{{ alumno.salud.discapacidades }}</p>
            </div>

            <div class="p-4 bg-green-50 rounded-xl">
              <p>{{ alumno.salud.medicamentos }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4">
            <i class="pi pi-exclamation-circle mr-2"></i>
            Reportes del alumno
          </h3>

          <div v-if="tieneReportes" class="space-y-3">
            <div
              v-for="r in reportes"
              :key="r.titulo"
              class="flex justify-between p-4 bg-gray-50 rounded-xl"
            >
              <p>{{ r.titulo }}</p>
              <i class="pi pi-flag text-red-500"></i>
            </div>
          </div>

          <div v-else class="text-gray-500 text-sm">
            Sin reportes registrados
          </div>
        </div>

        <div class="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <h3 class="font-semibold">
            <i class="pi pi-cog mr-2"></i> Edición
          </h3>

          <div>
            <label>Grado</label>
            <select v-model="alumno.grado" class="w-full border p-2 rounded-lg">
              <option>1°</option><option>2°</option><option>3°</option>
              <option>4°</option><option>5°</option><option>6°</option>
            </select>
          </div>

          <div>
            <label>Sección</label>
            <select v-model="alumno.seccion" class="w-full border p-2 rounded-lg">
              <option>A</option><option>B</option><option>C</option><option>D</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4">

            <button class="bg-indigo-600 border border-indigo-600 text-white py-2 rounded-xl flex justify-center gap-2">
              <i class="pi pi-save"></i> Guardar
            </button>

            <button
              @click="emit('cerrar')"
              class="bg-gray-100 border border-gray-400 hover:bg-red-50 text-gray-600 hover:text-red-500 py-2 rounded-xl flex justify-center gap-2"
            >
              <i class="pi pi-times"></i> Cerrar
            </button>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>
