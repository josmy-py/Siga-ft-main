<script setup>
const emit = defineEmits(["cerrar"]);
</script>

<template>
  <div class="bg-gray-200 min-h-screen flex justify-center py-10">

    <!-- BOTÓN CERRAR -->
    <button
      @click="emit('cerrar')"
      class="fixed top-4 left-4 border border-transparent bg-transparent px-3 py-2 rounded z-50"
    >
      <i class="pi pi-times text-white text-xl"></i>
    </button>

    <!-- HOJA -->
    <div class="bg-white w-[794px] h-[1123px] shadow-2xl p-8">

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

            <p class="text-sm text-gray-500">
              Departamento de Orientación y Disciplina
            </p>
          </div>

        </div>
      </div>

      <!-- TITULO -->
      <div
        class="bg-gray-100 rounded-md border border-gray-200 overflow-hidden mt-3"
      >
        <div class="px-4 py-2">
          <h2 class="text-base text-center font-semibold text-gray-800 uppercase">
            CONSTANCIA DE CONDUCTA
          </h2>
        </div>
      </div>

      <!-- CONTENIDO -->
      <div class="mt-4 text-gray-800">

        <p class="text-sm">
          El suscrito director(a) de la institución hace constar que el estudiante:
        </p>

        <!-- DATOS -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">

          <div class="grid grid-cols-2 gap-y-2 text-sm">

            <p>
              <strong>Nombre completo:</strong>
              Carlos Alberto Hernández Pérez
            </p>

            <p>
              <strong>Documento de identidad:</strong>
              04561237-9
            </p>

            <p>
              <strong>Nivel académico:</strong>
              Secundaria
            </p>

            <p>
              <strong>Grado:</strong>
              8°
            </p>

            <p>
              <strong>Sección:</strong>
              A
            </p>

          </div>

        </div>

        <!-- TEXTO -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">

          <p class="text-gray-700 text-justify leading-6">
            Se hace constar que el estudiante antes mencionado mantiene una
            <strong> conducta ejemplar </strong>
            dentro y fuera del aula, demostrando respeto hacia sus compañeros,
            docentes y autoridades del centro educativo.
          </p>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            Durante el período evaluado, no presenta reportes disciplinarios
            negativos ni sanciones que afecten su historial académico.
          </p>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            Motivo: Constancia solicitada para trámites personales y académicos.
          </p>

        </div>

        <!-- FECHA -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <p class="text-sm">
            <strong>Fecha de emisión:</strong>
            15 / 06 / 2026
          </p>
        </div>

      </div>

      <!-- FIRMAS -->
      <div class="mt-10 flex justify-between gap-8">

        <div class="text-center flex-1">
          <div class="border-t border-black"></div>
          ______________________

          <p class="mt-2 font-semibold">
            Director(a)
          </p>

          <p class="text-sm text-gray-600">
            Lic. María González
          </p>
        </div>

        <div class="text-center flex-1">
          <div class="border-t border-black"></div>
          ______________________

          <p class="mt-2 font-semibold">
             Profesor
          </p>
        </div>

      </div>

    </div>
  </div>
</template>
