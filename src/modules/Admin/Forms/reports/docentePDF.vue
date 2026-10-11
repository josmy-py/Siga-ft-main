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

    <!-- HOJA A4 -->
    <div class="bg-white w-[794px] min-h-[1123px] shadow-2xl border border-gray-300 p-8">

      <div class="text-gray-800 font-sans">

        <!-- ENCABEZADO -->
        <header class="border border-gray-300 p-4">
          <div class="flex items-center justify-center gap-4">

            <img
              src="/public/LogoDefi.jpeg"
              alt="Logo Institucional"
              class="w-16 h-16 object-contain"
            />

            <div class="text-center">
              <h1 class="text-xl font-bold uppercase leading-tight">
                COMPLEJO EDUCATIVO HACIENDA COLIMA CANTÓN EL TULE
              </h1>

              <p class="text-gray-600 text-sm mt-1">
                Informe del Personal Docente
              </p>
            </div>

          </div>
        </header>

        <!-- CONTENIDO -->
        <main class="mt-4 space-y-6">

          <!-- IDENTIFICACIÓN -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase">
              Identificación
            </h3>

            <div class="grid grid-cols-3 gap-4 text-sm">

              <div>
                <p class="text-gray-500">Nivel Académico</p>
                <p class="font-semibold">Básica</p>
              </div>

              <div>
                <p class="text-gray-500">Período</p>
                <p class="font-semibold">Primer Trimestre</p>
              </div>

              <div>
                <p class="text-gray-500">Fecha</p>
                <p class="font-semibold">12/06/2026</p>
              </div>

            </div>
          </section>

          <!-- ESTADÍSTICAS -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-4 uppercase">
              Estadísticas Docentes
            </h3>

            <table class="w-full text-sm border-collapse">

              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-2 text-left">Indicador</th>
                  <th class="border border-gray-300 p-2 text-left w-40">Resultado</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="border border-gray-300 p-2">Total de Docentes</td>
                  <td class="border border-gray-300 p-2">325</td>
                </tr>

                <tr>
                  <td class="border border-gray-300 p-2">Docentes Activos</td>
                  <td class="border border-gray-300 p-2">8.4</td>
                </tr>

                <tr>
                  <td class="border border-gray-300 p-2">Docentes Ausentes</td>
                  <td class="border border-gray-300 p-2">91%</td>
                </tr>
              </tbody>

            </table>
          </section>

          <!-- CONTROL DE ASISTENCIA -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-4 uppercase">
              Control de Asistencia
            </h3>

            <div class="border border-gray-300 text-sm">

              <div class="grid grid-cols-2 border-t">
                <div class="p-2">Asistencia Promedio</div>
                <div class="p-2">96%</div>
              </div>

              <div class="grid grid-cols-2 border-t">
                <div class="p-2">Incapacidades</div>
                <div class="p-2">4</div>
              </div>

            </div>
          </section>

          <!-- DESEMPEÑO -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-4 uppercase">
              Desempeño Docente
            </h3>

            <table class="w-full text-sm border-collapse">

              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-2 text-left">Indicador</th>
                  <th class="border border-gray-300 p-2 text-left w-40">Resultado</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="border border-gray-300 p-2">Docentes Evaluados</td>
                  <td class="border border-gray-300 p-2">14</td>
                </tr>

                <tr>
                  <td class="border border-gray-300 p-2">Promedio de Evaluación</td>
                  <td class="border border-gray-300 p-2">9.2</td>
                </tr>
              </tbody>

            </table>

            <p class="mt-2 text-gray-700 text-justify text-sm">
              El personal docente presentó un desempeño altamente satisfactorio,
              cumpliendo con planificación, actividades académicas y participación institucional.
            </p>
          </section>

          <!-- CAPACITACIONES -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase">
              Capacitaciones
            </h3>

            <p class="text-gray-700 text-sm text-justify">
              Se realizaron capacitaciones en metodologías activas, evaluación por competencias y herramientas digitales educativas.
            </p>
          </section>

          <!-- RECONOCIMIENTOS -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase">
              Reconocimientos
            </h3>

            <ul class="list-disc pl-5 text-sm text-gray-700 space-y-2">
              <li>Docente destacado del trimestre</li>
              <li>Innovación en prácticas pedagógicas</li>
              <li>Participación en proyectos institucionales</li>
            </ul>
          </section>

          <!-- OBSERVACIONES -->
          <section>
            <h3 class="font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase">
              Observaciones Generales
            </h3>

            <p class="text-gray-700 text-sm text-justify">
              El personal docente mantiene un alto nivel de compromiso institucional,
              se recomienda continuar fortaleciendo la formación continua.
            </p>
          </section>

          <!-- FIRMAS -->
          <div class="grid grid-cols-2 py-6 gap-8 mt-12">

            <div class="text-center text-sm">
              _______________________
              <p class="mt-2">Directora Institucional</p>
            </div>

            <div class="text-center text-sm">
              _______________________
              <p class="mt-2">Sello Institucional</p>
            </div>

          </div>

        </main>

      </div>
    </div>

  </div>
</template>
