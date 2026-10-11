<script setup>
const emit = defineEmits(["cerrar"]);
</script>

<template>
  <div>
    <button
      @click="emit('cerrar')"
      class="p-2 border border-transparent bg-transparent rounded-lg"
    >
      <i class="pi pi-times text-xl text-white"></i>
    </button>

    <div class="bg-white w-[794px] min-h-[1123px] mx-auto my-6 shadow-2xl p-8">
      <div class="border border-gray-300 min-h-[1050px] p-6">

        <!-- ENCABEZADO -->
        <div class="border-b pb-4">
          <div class="flex items-center justify-center gap-4">

            <!-- LOGO -->
            <img
              src="/public/LogoDefi.jpeg"
              alt="Logo Institucional"
              class="w-20 h-20 object-contain"
            />

            <!-- TITULOS -->
            <div class="text-center">
              <h1 class="text-xl font-bold uppercase">
                COMPLEJO EDUCATIVO HACIENDA COLIMA CANTÓN EL TULE
              </h1>
              <p class="text-gray-500 text-sm mt-1">
                AÑO LECTIVO 2026
              </p>
            </div>

          </div>
        </div>

        <!-- TITULO REPORTE -->
        <div
          class="bg-gray-100 rounded-md border border-gray-200 overflow-hidden mt-3"
        >
          <div class="px-4 py-2">
            <h2 class="text-base text-center font-semibold text-gray-800">
              REPORTE DE LIBRETA DE NOTAS
            </h2>
          </div>
        </div>

        <!-- DATOS GENERALES -->
        <div class="grid grid-cols-2 gap-y-1 mt-4 text-sm">
          <p><strong>Fecha:</strong> 12/06/2026</p>
          <p><strong>Período:</strong> Primer Trimestre</p>
          <p><strong>Grado:</strong> Séptimo Grado</p>
          <p><strong>Sección:</strong> A</p>
          <p><strong>Profesor:</strong> Prof. González</p>
        </div>

        <!-- ESTUDIANTE -->
        <div
          class="bg-gray-100 mt-4 rounded-md border border-gray-200 overflow-hidden"
        >
          <div class="px-4 py-2">
            <h2 class="text-sm font-semibold text-gray-800 uppercase">
              Información del Estudiante
            </h2>

            <p class="text-gray-600 mt-1">
              <strong>Nombre:</strong>
              María Fernanda Ruiz
            </p>
          </div>
        </div>

        <!-- CONDUCTA -->
        <div
          class="mt-4 bg-gray-50 rounded-md border border-gray-200 overflow-hidden"
        >
          <div class="px-4 py-2">
            <h2 class="text-sm font-semibold text-gray-800 uppercase">
              Conducta del Estudiante
            </h2>

            <div class="grid grid-cols-2 mt-2 text-sm text-gray-700">
              <p>
                <strong>Conducta:</strong>
                Excelente
              </p>
            </div>

            <p class="mt-2 text-gray-600 text-justify">
              El estudiante mantiene una conducta adecuada dentro del aula,
              respeta las normas institucionales y participa de forma ordenada
              en clase.
            </p>
          </div>
        </div>

        <!-- CALIFICACIONES -->
        <div class="mt-5">
          <h3 class="font-semibold text-gray-700 border-b pb-1">
            DETALLE DE CALIFICACIONES
          </h3>
        </div>

        <table class="w-full mt-3 border border-gray-300 text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2 text-left">Materia</th>
              <th class="border p-2 text-center">Nota</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="border p-2">Matemáticas</td>
              <td class="border p-2 text-center">8.3</td>
            </tr>
            <tr>
              <td class="border p-2">Lenguaje</td>
              <td class="border p-2 text-center">9.0</td>
            </tr>
            <tr>
              <td class="border p-2">Ciencias Naturales</td>
              <td class="border p-2 text-center">8.2</td>
            </tr>
            <tr>
              <td class="border p-2">Estudios Sociales</td>
              <td class="border p-2 text-center">8.7</td>
            </tr>
            <tr>
              <td class="border p-2">Inglés</td>
              <td class="border p-2 text-center">9.4</td>
            </tr>
          </tbody>

          <tfoot>
            <tr class="bg-gray-100 font-semibold">
              <td class="border p-2">Promedio General</td>
              <td class="border p-2 text-center">8.72</td>
            </tr>
          </tfoot>
        </table>

        <!-- OBSERVACIONES -->
        <div class="mt-6">
          <h2 class="font-bold border-b pb-1">
            Observaciones
          </h2>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            El estudiante ha mostrado una participación adecuada durante el
            período evaluado, manteniendo una actitud respetuosa. Cumple con la
            mayoría de las actividades asignadas y demuestra interés por mejorar
            su desempeño académico.
          </p>
        </div>

        <!-- FIRMAS -->
        <div class="flex justify-between mt-16">
          <div class="text-center">
            <div class="w-56 border-t border-black mx-auto"></div>
            _______________________
            <p class="mt-2">Docente</p>
          </div>

          <div class="text-center">
            <div class="w-56 border-t border-black mx-auto"></div>
            _______________________
            <p class="mt-2">Director(a)</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
