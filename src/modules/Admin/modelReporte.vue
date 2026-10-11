<script setup>
const emit = defineEmits([
  "cerrar",
  "seleccionar"
]);
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">
          Tipo de Reporte
        </h2>

        <button
          @click="emit('cerrar')"
          class="p-2 border border-gray-500 rounded-lg hover:bg-gray-100 transition"
        >
          <i class="pi pi-times text-xl text-gray-600"></i>
        </button>
      </div>

      <p class="text-gray-600 mb-4">
        Selecciona el tipo de reporte
      </p>

      <div class="grid grid-cols-2 gap-4">
        <button
          @click="emit('seleccionar', 'academico')"
          class="p-4 border border-violet-200 rounded-lg bg-violet-50 hover:bg-violet-100 transition text-left"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-graduation-cap text-2xl text-violet-600"></i>

            <div>
              <h3 class="font-semibold text-gray-800">
                Reporte Académico
              </h3>

              <p class="text-sm text-gray-500">
                Informe sobre el rendimiento académico
              </p>
            </div>
          </div>
        </button>

        <button
          @click="emit('seleccionar', 'conducta')"
          class="p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition text-left"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-id-card text-2xl text-blue-600"></i>

            <div>
              <h3 class="font-semibold text-gray-800">
                Reporte de Conducta
              </h3>

              <p class="text-sm text-gray-500">
                Informe sobre comportamientos y situaciones
              </p>
            </div>
          </div>
        </button>

        <button
          @click="emit('seleccionar', 'docente')"
          class="p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition text-left"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-users text-2xl text-green-600"></i>

            <div>
              <h3 class="font-semibold text-gray-800">
                Reporte Docente
              </h3>

              <p class="text-sm text-gray-500">
                Evalúa y seguimiento del desempeño docente
              </p>
            </div>
          </div>
        </button>

        <button
          @click="emit('seleccionar', 'institucional')"
          class="p-4 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-left"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-building-columns text-2xl text-amber-600"></i>

            <div>
              <h3 class="font-semibold text-gray-800">
                Reporte Institucional
              </h3>

              <p class="text-sm text-gray-500">
                Informe sobre asuntos generales de institución
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
