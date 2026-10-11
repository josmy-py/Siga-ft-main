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

            <img
              src="/public/LogoDefi.jpeg"
              alt="Logo Institucional"
              class="w-16 h-16 object-contain"
            />

            <div class="text-center">
              <h1 class="text-xl font-bold uppercase">
                COMPLEJO EDUCATIVO HACIENDA COLIMA CANTÓN EL TULE
              </h1>

              <p class="text-gray-500 text-sm mt-1">
                Evaluación del rendimiento por asignatura
              </p>
            </div>

          </div>
        </div>

        <!-- TITULO -->
        <div class="bg-gray-100 rounded-md border border-gray-200 mt-3">
          <div class="px-4 py-2">
            <h2 class="text-base text-center font-semibold text-gray-800 uppercase">
              REPORTE DE RENDIMIENTO ACADÉMICO
            </h2>
          </div>
        </div>

        <!-- DATOS GENERALES -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <div class="grid grid-cols-2 gap-y-2 text-sm">

            <div>
              <strong>Grado:</strong>
              Cuarto Grado
            </div>

            <div>
              <strong>Sección:</strong>
              B
            </div>

            <div>
              <strong>Profesor:</strong>
              Prof. González
            </div>

            <div>
              <strong>Fecha:</strong>
              01/06/2026
            </div>

          </div>
        </div>

        <!-- RESUMEN -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 mb-3 uppercase">
            Resumen Académico
          </h3>

          <div class="grid grid-cols-2 gap-y-2 text-sm">

            <div>
              <strong>Total de estudiantes:</strong>
              5
            </div>

            <div>
              <strong>Promedio general:</strong>
              8.72
            </div>

            <div>
              <strong>Materia:</strong>
              Matemáticas
            </div>

            <div>
              <strong>Período:</strong>
              Primer Trimestre
            </div>

          </div>
        </div>

        <!-- DESTACADOS -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 mb-3 uppercase">
            Estudiantes Destacados (Promedio ≥ 9.0)
          </h3>

          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border p-2 text-left">
                  Alumno
                </th>

                <th class="border p-2 text-center">
                  Promedio
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="border p-2">
                  Lesly Martinez
                </td>

                <td class="border p-2 text-center font-semibold">
                  9.0
                </td>
              </tr>
            </tbody>
          </table>

          <p class="text-xs text-gray-500 mt-2">
            Se consideran estudiantes destacados aquellos que obtienen una
            calificación igual o superior a 9.0.
          </p>
        </div>

        <!-- OBSERVACIONES -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 uppercase">
            Observaciones
          </h3>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            El grupo presenta un rendimiento académico satisfactorio durante el
            período evaluado. Se destaca el compromiso de los estudiantes con
            desempeño sobresaliente y se recomienda continuar fortaleciendo los
            hábitos de estudio para mantener y mejorar los resultados obtenidos.
          </p>
        </div>

        <!-- FIRMAS -->
        <div class="flex justify-between mt-16">

          <div class="text-center">
            <div class="w-56 border-t border-black mx-auto"></div>
            <p class="mt-2">Docente</p>
          </div>

          <div class="text-center">
            <div class="w-56 border-t border-black mx-auto"></div>
            <p class="mt-2">Director(a)</p>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
