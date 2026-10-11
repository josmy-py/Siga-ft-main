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
      class="bg-white w-[794px] min-h-[1123px] mx-auto my-16 shadow-2xl border border-gray-300"
    >

      <!-- MÁRGENES -->
      <div class="px-14 py-12">

        <!-- ENCABEZADO -->
        <header class="border-b pb-5 mb-5">
          <div class="flex items-center justify-center gap-4">

            <!-- LOGO -->
            <img
              src="/public/LogoDefi.jpeg"
              class="w-16 h-16 object-contain"
              alt="logo"
            />

            <div class="text-center">
              <h1 class="text-xl font-bold text-gray-800 leading-tight uppercase">
                COMPLEJO EDUCATIVO HACIENDA COLIMA CANTÓN EL TULE
              </h1>

              <p class="text-gray-600 mt-2">
                Informe Institucional de Conducta y Convivencia Escolar
              </p>
            </div>

          </div>
        </header>

        <!-- CONTENIDO -->
        <main class="space-y-3">

          <!-- INFORMACIÓN GENERAL -->
          <section class="border rounded-md p-5">

            <h2 class="font-bold text-gray-800 border-b pb-2 mb-5 uppercase">
              Información General
            </h2>

            <div class="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p class="text-gray-500">Fecha</p>
                <p class="font-semibold">14/06/2026</p>
              </div>

              <div>
                <p class="text-gray-500">Período</p>
                <p class="font-semibold">Segundo Trimestre</p>
              </div>

              <div>
                <p class="text-gray-500">Director Responsable</p>
                <p class="font-semibold">Juan Pérez</p>
              </div>
            </div>

          </section>

          <!-- RESUMEN -->
          <section class="border rounded-md py-2 p-5">

            <h2 class="font-bold text-gray-800 border-b pb-1 mb-3 uppercase">
              Resumen General
            </h2>

            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-3 text-left">Registro</th>
                  <th class="border p-3 text-left">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="border p-3">Total de Estudiantes</td>
                  <td class="border p-3">520</td>
                </tr>

                <tr>
                  <td class="border p-3">Incidentes Registrados</td>
                  <td class="border p-3">18</td>
                </tr>

                <tr>
                  <td class="border p-3">Casos Resueltos</td>
                  <td class="border p-3">15</td>
                </tr>

                <tr>
                  <td class="border p-3">Casos Pendientes</td>
                  <td class="border p-3">3</td>
                </tr>
              </tbody>
            </table>

          </section>

          <!-- CLASIFICACIÓN -->
          <section class="border rounded-md p-5">

            <h2 class="font-bold text-gray-800 border-b pb-1 mb-3 uppercase">
              Clasificación de Reportes
            </h2>

            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-3 text-left">Nivel</th>
                  <th class="border p-3 text-left">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td class="border p-3">Leves</td>
                  <td class="border p-3">10</td>
                </tr>

                <tr>
                  <td class="border p-3">Moderados</td>
                  <td class="border p-3">5</td>
                </tr>

                <tr>
                  <td class="border p-3">Graves</td>
                  <td class="border p-3">3</td>
                </tr>
              </tbody>
            </table>

          </section>

          <!-- INCIDENTES -->
          <section class="border rounded-md py-2 p-5">

            <h2 class="font-bold text-gray-800 border-b pb-1 mb-2 uppercase">
              Incidentes Registrados
            </h2>

            <p class="text-gray-700 leading-7 text-justify">
              Durante el período evaluado se registraron incidentes disciplinarios...
            </p>

          </section>

          <!-- MEDIDAS -->
          <section class="border rounded-md py-1 p-5">

            <h2 class="font-bold text-gray-800 border-b pb-1 mb-2 uppercase">
              Medidas Disciplinarias
            </h2>

            <ul class="list-disc pl-6 space-y-2 text-gray-700 leading-7">
              <li>Amonestaciones verbales.</li>
              <li>Amonestaciones escritas.</li>
              <li>Seguimiento por orientación escolar.</li>
              <li>Compromisos de mejora conductual.</li>
            </ul>

          </section>

          <!-- OBSERVACIONES -->
          <section class="border rounded-md py-2 p-5">

            <h2 class="font-bold text-gray-800 border-b pb-2 mb-5 uppercase">
              Observaciones Generales
            </h2>

            <p class="text-gray-700 leading-7 text-justify">
              Se observa una mejora en el comportamiento general...
            </p>

          </section>

          <!-- RECOMENDACIONES -->
          <section class="border rounded-md py-1 p-5">

            <h2 class="font-bold text-gray-800 border-b pb-2 mb-5 uppercase">
              Recomendaciones
            </h2>

            <ul class="list-disc pl-6 space-y-2 text-gray-700 leading-7">
              <li>Continuar fortaleciendo la convivencia escolar.</li>
              <li>Incrementar actividades de prevención.</li>
              <li>Dar seguimiento a casos pendientes.</li>
            </ul>

          </section>

          <!-- FIRMAS -->
          <div class="grid grid-cols-2 gap-10 py-8 mt-14">

            <div class="text-center">
              <div class="border-t border-black"></div>
              _______________________
              <p class="mt-2">Director</p>
            </div>

            <div class="text-center">
              <div class="border-t border-black"></div>
              _______________________
              <p class="mt-2">Sello Institucional</p>
            </div>

          </div>

        </main>

      </div>
    </div>

  </div>
</template>
