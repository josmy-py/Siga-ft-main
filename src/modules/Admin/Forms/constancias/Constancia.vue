<script setup>
const emit = defineEmits(["cerrar"]);
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <!-- ENCABEZADO -->
    <div class="p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">Crear Constancia</h2>

      <p class="text-sm text-gray-500 mt-1">
        Complete la información necesaria para generar la constancia.
      </p>
    </div>

    <!-- FORMULARIO -->
    <form class="p-6 space-y-6">
      <!-- DATOS DEL SOLICITANTE -->
      <div>
        <h3 class="text-md font-semibold text-gray-700 mb-4">Información del Solicitante</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Nombre Completo </label>

            <input
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Documento de Identidad
            </label>

            <input
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="00000000-0"
            />
          </div>
        </div>
      </div>

      <!-- INFORMACIÓN ACADÉMICA -->
      <div>
        <h3 class="text-md font-semibold text-gray-700 mb-4">Información Académica</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- NIVEL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Nivel Académico </label>

            <select class="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option>Seleccione nivel</option>
              <option>Inicial</option>
              <option>Primaria</option>
              <option>Secundaria</option>
              <option>Bachillerato</option>
            </select>
          </div>

          <!-- GRADO -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Grado </label>

            <select class="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option>Seleccione grado</option>
              <option>1°</option>
              <option>2°</option>
              <option>3°</option>
              <option>4°</option>
              <option>5°</option>
              <option>6°</option>
            </select>
          </div>

          <!-- SECCIÓN -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Sección </label>

            <select class="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option>Seleccione sección</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
        </div>
      </div>

      <!-- TIPO -->
      <div>
        <h3 class="text-md font-semibold text-gray-700 mb-4">Información de la Constancia</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Tipo de Constancia </label>

            <select class="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option>Seleccione una opción</option>
              <option>Estudio</option>
              <option>Conducta</option>
              <option>Matrícula</option>
              <option>Egresado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Fecha de Emisión </label>

            <input type="date" class="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        </div>
      </div>

      <!-- CONTENIDO -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"> Descripción o Motivo </label>

        <textarea
          rows="6"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Escriba el contenido de la constancia..."
        ></textarea>
      </div>

      <!-- RESPONSABLE -->
      <div>
        <h3 class="text-md font-semibold text-gray-700 mb-4">Responsable de la Emisión</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Responsable
            </label>

            <input
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Director(a) o Coordinador(a)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Cargo </label>

            <input
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Director(a)"
            />
          </div>
        </div>
      </div>

      <!-- BOTONES -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="emit('cerrar')"
          class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>

        <button type="submit" class="px-5 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700">
          Generar Constancia
        </button>
      </div>
    </form>
  </div>
</template>
