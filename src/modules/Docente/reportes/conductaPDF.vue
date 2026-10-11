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

        <!-- TITULO -->
        <div class="bg-gray-100 rounded-md border border-gray-200 mt-3">
          <div class="px-4 py-2">
            <h2 class="text-base text-center font-semibold text-gray-800 uppercase">
              REPORTE DE CONDUCTA
            </h2>
          </div>
        </div>

        <!-- ESTUDIANTE -->
        <div class="bg-gray-100 mt-4 rounded-md border border-gray-200">
          <div class="px-4 py-3">

            <h2 class="text-sm font-semibold text-gray-800 uppercase mb-2">
              Información del Estudiante
            </h2>

            <div class="text-sm">
              <p>
                <strong>Nombre:</strong>
                Carlos López Ramírez
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-sm mt-2">
              <p>
                <strong>Fecha:</strong>
                10/06/2026
              </p>

              <p>
                <strong>Profesor:</strong>
                Prof. González
              </p>

              <p>
                <strong>Grado:</strong>
                Tercer Grado
              </p>

              <p>
                <strong>Sección:</strong>
                B
              </p>
            </div>

          </div>
        </div>

        <!-- TIPO DE REPORTE -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 uppercase">
            Tipo de Reporte
          </h3>

          <div class="mt-3 space-y-2 text-gray-700">

            <div class="flex items-center gap-2">
              <i class="pi pi-stop text-gray-400"></i>
              <span>Leve</span>
            </div>

            <div class="flex items-center gap-2">
              <i class="pi pi-check-square text-gray-400"></i>
              <span>Moderado</span>
            </div>

            <div class="flex items-center gap-2">
              <i class="pi pi-stop text-gray-400"></i>
              <span>Grave</span>
            </div>

          </div>
        </div>

        <!-- DESCRIPCION -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 uppercase">
            Descripción del Comportamiento Observado
          </h3>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            Durante el período evaluado, el estudiante ha presentado conductas
            que requieren seguimiento por parte del docente. Se han observado
            interrupciones ocasionales durante las actividades académicas,
            dificultades para mantener la atención en clase y escasa
            participación en algunas dinámicas grupales.
          </p>
        </div>

        <!-- ACCIONES -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 uppercase">
            Acciones Tomadas
          </h3>

          <div class="mt-3 space-y-2 text-gray-700">

            <p>
              <i class="pi pi-check-square mr-2 text-gray-400"></i>
              Llamado de atención verbal.
            </p>

            <p>
              <i class="pi pi-check-square mr-2 text-gray-400"></i>
              Orientación individual al estudiante.
            </p>

            <p>
              <i class="pi pi-check-square mr-2 text-gray-400"></i>
              Comunicación con madre, padre o responsable.
            </p>

            <p>
              <i class="pi pi-check-square mr-2 text-gray-400"></i>
              Seguimiento por coordinación.
            </p>

          </div>
        </div>

        <!-- COMPROMISOS -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold text-gray-700 border-b pb-1 uppercase">
            Compromisos de Mejora
          </h3>

          <p class="mt-3 text-gray-700 leading-6 text-justify">
            El estudiante se compromete a mantener una actitud respetuosa dentro
            del aula, seguir las indicaciones del docente y participar de manera
            adecuada en las actividades académicas programadas.
          </p>
        </div>

        <!-- FIRMAS -->
        <div class="grid grid-cols-3 gap-6 mt-16">

          <div class="text-center">
            <div class="w-full border-t border-black"></div>
            _______________________
            <p class="mt-2">Docente Responsable</p>
          </div>

          <div class="text-center">
            <div class="w-full border-t border-black"></div>
            ________________________
            <p class="mt-2">Padre / Madre o Responsable</p>
          </div>

          <div class="text-center">
            <div class="w-full border-t border-black"></div>
            _______________________
            <p class="mt-2">Director(a)</p>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
