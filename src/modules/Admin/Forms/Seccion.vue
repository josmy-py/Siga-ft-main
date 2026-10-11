<script setup>
import { ref } from "vue";

const emit = defineEmits(["save"]);

const secciones = ref({
  nombre: "",
  capacidad: "",
  turno: "",
  docente: "",
  grado: "",
  anio: "",
});

const limpiar = () => {
  secciones.value = {
    nombre: "",
    capacidad: "",
    turno: "",
    docente: "",
    grado: "",
    anio: "",
  };
};

const guardarSeccion = () => {
  if (!secciones.value.nombre || !secciones.value.capacidad) {
    alert("Por favor completa los campos requeridos");
    return;
  }

  console.log("Sección registrada:", secciones.value);
  alert("Sección registrada correctamente");

  emit("save", { ...secciones.value });

  limpiar();
};
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-blue-600 to-indigo-800 p-5 flex items-center gap-4">

        <div class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <i class="pi pi-users text-white text-2xl"></i>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-white">
            Nueva Sección
          </h2>
          <p class="text-blue-100">
            Gestión de secciones académicas
          </p>
        </div>

      </div>

      <form @submit.prevent="guardarSeccion" class="p-8">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nombre</label>
            <div class="relative">
              <i class="pi pi-tag absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="secciones.nombre"
                type="text"
                placeholder="Ej: A"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Capacidad</label>
            <div class="relative">
              <i class="pi pi-users absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="secciones.capacidad"
                type="number"
                placeholder="Ej: 30"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Turno</label>
            <div class="relative">
              <i class="pi pi-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="secciones.turno"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona un turno</option>
                <option value="Matutino">Mañana</option>
                <option value="Vespertino">Tarde</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Docente</label>
            <div class="relative">
              <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="secciones.docente"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona un docente</option>
                <option value="Juan Pérez">Juan Pérez</option>
                <option value="María López">María López</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado</label>
            <div class="relative">
              <i class="pi pi-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <select
                v-model="secciones.grado"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              >
                <option value="" disabled>Selecciona un grado</option>
                <option value="1°">1°</option>
                <option value="2°">2°</option>
                <option value="3°">3°</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Año</label>
            <div class="relative">
              <i class="pi pi-calendar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="secciones.anio"
                type="number"
                placeholder="Ej: 2024"
                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none transition"
              />
            </div>
          </div>

        </div>

        <div class="flex justify-end gap-3 mt-8">

          <button
            type="button"
            @click="limpiar"
            class="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            <i class="pi pi-refresh mr-2"></i>
            Limpiar
          </button>

          <button
            type="submit"
            class="px-6 py-3 rounded-xl bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 shadow-md transition flex items-center gap-2"
          >
            <i class="pi pi-check"></i>
            Guardar Sección
          </button>

        </div>

      </form>

    </div>
  </div>
</template>
