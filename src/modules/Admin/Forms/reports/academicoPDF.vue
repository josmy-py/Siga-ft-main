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
    <div
      class="bg-white w-[794px] min-h-[1123px] mx-auto my-6 shadow-2xl border border-gray-300"
    >

      <!-- MÁRGENES -->
      <div class="px-12 py-6">

        <!-- ENCABEZADO -->
        <div class="border-b pb-3">
          <div class="flex items-center justify-center gap-4">

            <img
              src="/public/LogoDefi.jpeg"
              alt="Logo Institucional"
              class="w-16 h-16 object-contain"
            />

            <div class="text-center">
              <h1 class="text-xl font-bold uppercase text-gray-800">
                COMPLEJO EDUCATIVO HACIENDA COLIMA CANTÓN EL TULE
              </h1>

              <p class="text-gray-500 text-sm mt-1">
                Informe Académico Institucional
              </p>
            </div>

          </div>
        </div>

        <!-- TITULO -->
        <div
          class="bg-gray-100 rounded-md border border-gray-200 overflow-hidden mt-3"
        >
          <div class="px-3 py-1.5">
            <h2 class="text-base text-center font-semibold text-gray-800 uppercase">
              Informe Académico Institucional
            </h2>
          </div>
        </div>

        <!-- CONTENIDO -->
        <main class="mt-3 space-y-2">

          <!-- IDENTIFICACIÓN -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-1 uppercase"
            >
              Identificación
            </h3>

            <div class="grid grid-cols-3 gap-4">

              <div>
                <p class="text-xs text-gray-500">
                  Nivel Académico
                </p>

                <p class="font-semibold text-gray-800">
                  Básica
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">
                  Período
                </p>

                <p class="font-semibold text-gray-800">
                  Primer Trimestre
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">
                  Fecha
                </p>

                <p class="font-semibold text-gray-800">
                  12/06/2026
                </p>
              </div>

            </div>

          </section>

          <!-- RESPONSABLE -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-1 uppercase"
            >
              Responsable
            </h3>

            <div class="grid grid-cols-3 gap-4">

              <div>
                <p class="text-xs text-gray-500">
                  Nombre
                </p>

                <p class="font-semibold text-gray-800">
                  María Fernanda López
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">
                  Cargo
                </p>

                <p class="font-semibold text-gray-800">
                  Directora
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-500">
                  Correo
                </p>

                <p class="font-semibold text-gray-800">
                  direccion@nuevaesperanza.edu.sv
                </p>
              </div>

            </div>

          </section>

          <!-- INDICADORES -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-1 uppercase"
            >
              Indicadores Académicos
            </h3>

            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">
                    Indicador
                  </th>

                  <th class="border p-2 text-left">
                    Resultado
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="border p-2">
                    Total de Estudiantes
                  </td>

                  <td class="border p-2">
                    325
                  </td>
                </tr>

                <tr>
                  <td class="border p-2">
                    Promedio General
                  </td>

                  <td class="border p-2">
                    8.4
                  </td>
                </tr>

                <tr>
                  <td class="border p-2">
                    % Aprobación
                  </td>

                  <td class="border p-2">
                    91%
                  </td>
                </tr>

                <tr>
                  <td class="border p-2">
                    % Reprobación
                  </td>

                  <td class="border p-2">
                    9%
                  </td>
                </tr>
              </tbody>
            </table>

          </section>

          <!-- RENDIMIENTO -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-2 uppercase"
            >
              Rendimiento Académico
            </h3>

            <p class="text-gray-700 leading-6 text-justify">
              Durante el primer trimestre se observó un desempeño académico
              favorable en la mayoría de los grados. Los estudiantes mostraron
              avances significativos en lectura comprensiva, escritura y
              resolución de problemas matemáticos.
            </p>

          </section>

          <!-- MATERIAS -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-2 uppercase"
            >
              Materias con Mayor y Menor Rendimiento
            </h3>

            <table class="w-full text-sm">
              <tbody>
                <tr>
                  <td class="border p-2 font-medium">
                    Mayor Rendimiento
                  </td>

                  <td class="border p-2">
                    Lenguaje y Literatura
                  </td>
                </tr>

                <tr>
                  <td class="border p-2 font-medium">
                    Menor Rendimiento
                  </td>

                  <td class="border p-2">
                    Matemática
                  </td>
                </tr>
              </tbody>
            </table>

          </section>

          <!-- DESTACADOS -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-2 uppercase"
            >
              Estudiantes Destacados
            </h3>

            <ul class="list-disc pl-5 space-y-1 text-gray-700 leading-6">
              <li>Ana Sofía Hernández - Sexto Grado</li>
              <li>Carlos Eduardo Ramírez - Séptimo Grado</li>
              <li>Valeria González - Noveno Grado</li>
              <li>José Alexander Pérez - Quinto Grado</li>
            </ul>

          </section>

          <!-- RECOMENDACIONES -->
          <section class="border border-gray-300 rounded-md p-3">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-1 uppercase"
            >
              Recomendaciones Académicas
            </h3>

            <ul class="list-disc pl-5 space-y-1 text-gray-700 leading-6">
              <li>Fortalecer las estrategias de refuerzo en Matemática.</li>
              <li>Incrementar actividades de lectura comprensiva.</li>
            </ul>

          </section>

          <!-- OBSERVACIONES -->
          <section class="border border-gray-300 rounded-md p-5">

            <h3
              class="font-semibold text-gray-700 border-b pb-1 mb-1 uppercase"
            >
              Observaciones Generales
            </h3>

            <p class="text-gray-700 leading-6 text-justify">
              El clima académico institucional se mantiene favorable para el
              aprendizaje. Se observa compromiso por parte del personal docente
              y disposición de los estudiantes para alcanzar los objetivos
              establecidos durante el período evaluado.
            </p>

          </section>

          <!-- FIRMAS -->
          <div class="grid grid-cols-2 gap-2 mt-8">

            <div class="text-center">
              <div class="border-t border-black"></div>
              _______________________

              <p class="mt-2">
                Directora Institucional
              </p>
            </div>

            <div class="text-center">
              <div class="border-t border-black"></div>
              _______________________

              <p class="mt-2">
                Sello Institucional
              </p>
            </div>

          </div>

        </main>

      </div>

    </div>

  </div>
</template>
