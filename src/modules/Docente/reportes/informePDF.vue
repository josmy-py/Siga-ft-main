<script setup>
const emit = defineEmits(["cerrar"]);
</script>

<template>
  <div>
    <!-- BOTÓN CERRAR -->
    <button
      @click="emit('cerrar')"
      class="p-2 border border-transparent bg-transparent rounded-lg"
    >
      <i class="pi pi-times text-xl text-white"></i>
    </button>

    <!-- HOJA A4 -->
    <div class="bg-white w-[794px] min-h-[1123px] mx-auto my-6 shadow-2xl p-8">
      <!-- BORDE INTERNO -->
      <div class="border border-gray-300 min-h-[1050px] p-6 text-gray-800 font-sans">

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
                Informe de actividades académicas
              </p>
            </div>

          </div>
        </div>

        <!-- TITULO -->
        <div class="bg-gray-100 rounded-md border border-gray-200 mt-3">
          <div class="px-4 py-2">
            <h2 class="text-base text-center font-semibold text-gray-800 uppercase">
              INFORME PROFESOR
            </h2>
          </div>
        </div>

        <!-- DATOS GENERALES -->
        <div class="mt-4 border border-gray-300 rounded-md p-4">
          <div class="grid grid-cols-2 gap-y-2 text-sm">

            <div>
              <strong>Grado:</strong>
              Tercero Grado
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
              08/06/2026
            </div>

          </div>
        </div>

        <!-- ASUNTO -->
        <div class="mt-3 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold border-b pb-1 uppercase text-gray-700">
            Asunto
          </h3>

          <p class="mt-2 text-gray-700 text-justify leading-6">
            Evaluación del rendimiento académico en las áreas fundamentales del
            currículo básico.
          </p>
        </div>

        <!-- DESARROLLO -->
        <div class="mt-3 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold border-b pb-1 uppercase text-gray-700">
            Desarrollo del Informe
          </h3>

          <p class="mt-2 text-gray-700 text-justify leading-6">
            Durante el presente periodo académico se evaluó el rendimiento de
            los estudiantes en las áreas fundamentales del currículo básico. En
            general, se evidencia un avance en el proceso de aprendizaje, con
            logros acordes al nivel esperado en la mayoría de los casos. No
            obstante, algunos estudiantes presentan dificultades en determinadas
            competencias, por lo que se considera necesario reforzar los
            contenidos y brindar acompañamiento pedagógico para mejorar su
            desempeño.
          </p>
        </div>

        <!-- OBSERVACIONES -->
        <div class="mt-3 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold border-b pb-1 uppercase text-gray-700">
            Observaciones
          </h3>

          <p class="mt-3 text-gray-700 text-justify leading-6">
            Se identifica un grupo de estudiantes que requiere mayor refuerzo
            en lectura comprensiva y escritura. Se observa buena participación
            en actividades grupales, aunque algunos estudiantes muestran poca
            constancia en el trabajo individual. Es recomendable fortalecer el
            hábito de estudio y la responsabilidad en la entrega de tareas.
          </p>
        </div>

        <!-- EVIDENCIA -->
        <div class="mt-3 border border-gray-300 rounded-md p-4">
          <h3 class="font-semibold border-b pb-1 uppercase text-gray-700">
            Evidencia Adjunta
          </h3>

          <div class="mt-2 text-sm text-gray-700 space-y-1">
            <p>📷 actividad_en_clase_01.jpg</p>
            <p>📷 trabajo_grupal_02.png</p>
            <p>📄 guia_ejercicios_trimestre1.pdf</p>
          </div>
        </div>

        <!-- FIRMAS -->
        <div class="grid grid-cols-2 gap-6 mt-16">

          <div class="text-center">
            <div class="w-full border-t border-black"></div>
            _______________________
            <p class="mt-2">Docente Responsable</p>
          </div>

          <div class="text-center">
            <div class="w-full border-t border-black"></div>
            _______________________
            <p class="mt-2">Director(a)</p>
          </div>

        </div>

        <!-- PIE -->
        <div class="mt-6 text-center text-xs text-gray-400">
          Documento generado automáticamente por el sistema académico
        </div>

      </div>
    </div>
  </div>
</template>
