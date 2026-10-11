<script setup>
import { ref } from "vue";
import Estudiantes from "@/modules/Admin/Estudiantes.vue";

const adminName = ref("Administrador");
const mostrarEstudiante = ref(false);

const abrirModal = () => {
  mostrarEstudiante.value = true;
};

const cerrarModal = () => {
  mostrarEstudiante.value = false;
};

// datos
const search = ref("");

const filtros = ref({
  grado: "",
  seccion: "",
  anio: "",
});

const estudiantes = ref([
  {
    nombre: "Ana Martínez",
    nie: "2024001",
    correo: "ana@email.com",
    anio: "2026",
    grado: "3°",
    seccion: "A",
  },
  {
    nombre: "Carlos Pérez",
    nie: "2024002",
    correo: "carlos@email.com",
    anio: "2026",
    grado: "2°",
    seccion: "B",
  },
]);
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-2 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Estudiantes</h1>
          </div>
        </div>
      </header>

      <div class="p-4 lg:p-6">
        <section class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-700 mb-4">Listado de Estudiantes</h2>

          <div class="flex flex-wrap gap-3 mb-5">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar"
              class="flex-1 min-w-[220px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <select v-model="filtros.grado" class="px-3 py-2 border rounded-lg">
              <option value="">Todos los grados</option>
              <option value="1">1° grado</option>
              <option value="2">2° grado</option>
              <option value="3">3° grado</option>
            </select>

            <select v-model="filtros.seccion" class="px-3 py-2 border rounded-lg">
              <option value="">Todas las secciones</option>
              <option value="A">Sección A</option>
              <option value="B">Sección B</option>
              <option value="C">Sección C</option>
            </select>

            <select v-model="filtros.anio" class="px-3 py-2 border rounded-lg">
              <option value="">Todos los años</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            <button
              class="bg-blue-600 border border-transparent hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Buscar
            </button>

            <button
              class="bg-gray-200 border border-gray-400 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              @click="
                search = '';
                filtros = { grado: '', seccion: '', anio: '' };
              "
            >
              Limpiar
            </button>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table class="w-full text-left">
              <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th class="p-3">Nombre</th>
                  <th class="p-3">NIE</th>
                  <th class="p-3">Correo</th>
                  <th class="p-3">Año</th>
                  <th class="p-3">Grado</th>
                  <th class="p-3">Sección</th>
                  <th class="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(est, i) in estudiantes" :key="i" class="border-t hover:bg-gray-50">
                  <td class="p-3">{{ est.nombre }}</td>
                  <td class="p-3">{{ est.nie }}</td>
                  <td class="p-3">{{ est.correo }}</td>
                  <td class="p-3">{{ est.anio }}</td>
                  <td class="p-3">{{ est.grado }}</td>
                  <td class="p-3">{{ est.seccion }}</td>

                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-3">
                      <button
                        @click="abrirModal"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-eye"></i>
                        Ver
                      </button>

                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                      >
                        <i class="pi pi-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
    <Estudiantes v-if="mostrarEstudiante" @cerrar="cerrarModal" />
  </div>
</template>
