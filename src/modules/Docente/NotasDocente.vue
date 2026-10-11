<script setup>
import { ref, computed } from "vue";

const selectedTrimestre = ref("1");

const asignaturas = ref([
  { id: 1, nombre: "Matemáticas", grado: "3°", seccion: "B" },
  { id: 2, nombre: "Ciencias Naturales", grado: "3°", seccion: "B" },
  { id: 3, nombre: "Lenguaje y Literatura", grado: "4°", seccion: "A" },
]);

const estudiantesMatematicas = ref([
  { id: 1, nombre: "Ana Martínez", nota1: 8.5, nota2: 9.0, nota3: 8.8 },
  { id: 2, nombre: "Carlos López", nota1: 7.5, nota2: 8.0, nota3: 7.8 },
  { id: 3, nombre: "María García", nota1: 9.0, nota2: 9.5, nota3: 9.2 },
]);

const estudiantes = ref(estudiantesMatematicas.value);

const selectedGrado = ref("");
const selectedAsignatura = ref(null);

const asignaturasFiltradas = computed(() => {
  if (!selectedGrado.value) return asignaturas.value;

  return asignaturas.value.filter((a) => `${a.grado} ${a.seccion}` === selectedGrado.value);
});

const calcularPromedio = (e) => {
  return ((Number(e.nota1) + Number(e.nota2) + Number(e.nota3)) / 3).toFixed(1);
};

const getNotaEstadoClass = (promedio) => {
  return promedio >= 7 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Registro de Notas</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <div class="flex items-end gap-4 flex-wrap">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Grado </label>

              <select
                v-model="selectedGrado"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option value="">Todos los grados</option>

                <option
                  v-for="asig in asignaturas"
                  :key="asig.id"
                  :value="`${asig.grado} ${asig.seccion}`"
                >
                  {{ asig.grado }} {{ asig.seccion }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Asignatura </label>

              <select
                v-model="selectedAsignatura"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option :value="null">Seleccione asignatura</option>

                <option v-for="asig in asignaturasFiltradas" :key="asig.id" :value="asig">
                  {{ asig.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Trimestre </label>

              <select
                v-model="selectedTrimestre"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              >
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
              </select>
            </div>
          </div>
        </section>

        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-xl font-semibold text-gray-800">
              Calificaciones -
              {{ selectedAsignatura?.nombre || "Seleccione asignatura" }}
              ({{ selectedAsignatura?.grado || "" }} {{ selectedAsignatura?.seccion || "" }})
            </h2>
          </div>

          <div class="overflow-x-auto mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <table class="min-w-full">
              <thead class="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Estudiante
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Nota 30%
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Nota 40%
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Nota 30%
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Promedio
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Estado
                  </th>

                  <th
                    class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="estudiante in estudiantes"
                  :key="estudiante.id"
                  class="border-t border-gray-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                      >
                        <i class="pi pi-user text-blue-600"></i>
                      </div>

                      <span class="font-semibold text-gray-800">
                        {{ estudiante.nombre }}
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <input
                      v-model.number="estudiante.nota1"
                      type="number"
                      class="w-20 px-2 py-1 rounded-lg border border-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>

                  <td class="px-6 py-5 text-center">
                    <input
                      v-model.number="estudiante.nota2"
                      type="number"
                      class="w-20 px-2 py-1 rounded-lg border border-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>

                  <td class="px-6 py-5 text-center">
                    <input
                      v-model.number="estudiante.nota3"
                      type="number"
                      class="w-20 px-2 py-1 rounded-lg border border-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>

                  <td class="px-6 py-5 text-center font-bold text-blue-600">
                    {{ calcularPromedio(estudiante) }}
                  </td>

                  <td class="px-6 py-5 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="getNotaEstadoClass(calcularPromedio(estudiante))"
                    >
                      {{ calcularPromedio(estudiante) >= 7 ? "Aprobado" : "Desaprobado" }}
                    </span>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <button
                      class="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
