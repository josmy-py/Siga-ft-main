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
    <div class="bg-white w-[794px] min-h-[1123px] shadow-2xl p-8 relative">

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
              Departamento de Registro Académico
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
            Constancia de Egreso
          </h2>
        </div>
      </div>

      <!-- CONTENIDO -->
      <div class="mt-4 text-gray-800">

        <p class="text-sm">
          El suscrito director(a) de la institución hace constar que la estudiante:
        </p>

        <!-- DATOS -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">

          <div class="grid grid-cols-2 gap-y-2 text-sm">

            <p>
              <strong>Nombre completo:</strong>
              Andrea Sofía Ramírez Pérez
            </p>

            <p>
              <strong>Documento de identidad:</strong>
              09876543-2
            </p>

            <p>
              <strong>Nivel académico:</strong>
              Bachillerato
            </p>

            <p>
              <strong>Último grado cursado:</strong>
              2° Año de Bachillerato
            </p>

            <p>
              <strong>Sección:</strong>
              A
            </p>

            <p>
              <strong>Año de egreso:</strong>
              2025
            </p>

          </div>

        </div>

        <!-- TEXTO -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">

          <p class="text-gray-700 text-justify leading-6">
            Se hace constar que la estudiante ha culminado satisfactoriamente
            sus estudios en esta institución educativa, cumpliendo con todos los
            requisitos académicos establecidos.
          </p>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            Esta constancia se expide a solicitud de la interesada para los fines
            que estime convenientes.
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
      <div class="mt-12 flex justify-between gap-8">

        <div class="text-center flex-1">
          <div class="border-t border-black"></div>
          ___________________

          <p class="mt-2 font-semibold">
            Director(a)
          </p>

          <p class="text-sm text-gray-600">
            Lic. María González
          </p>
        </div>

        <div class="text-center flex-1">
          <div class="border-t border-black"></div>
          ___________________

          <p class="mt-2 font-semibold">
            Sello Institucional
          </p>
        </div>

      </div>

      <!-- MARCA DE AGUA -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
      >
        <h1 class="text-6xl font-bold -rotate-30">
          EGRESADO
        </h1>
      </div>

    </div>
  </div>
</template>
