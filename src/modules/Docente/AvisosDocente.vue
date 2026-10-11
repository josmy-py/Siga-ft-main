<script setup>
import { ref } from "vue";

const avisos = ref([
  {
    id: 1,
    titulo: "Reunión de Docentes",
    fecha: "2026-05-20",
    descripcion:
      "Se convoca a reunión de docentes el viernes 22 de mayo a las 3:00 PM en el auditorio principal.",
    tipo: "importante",
  },
  {
    id: 2,
    titulo: "Entrega de Calificaciones",
    fecha: "2026-05-18",
    descripcion:
      "Recordatorio: Las calificaciones del primer parcial deben ser entregadas antes del 25 de mayo.",
    tipo: "recordatorio",
  },
  {
    id: 3,
    titulo: "Día de la Familia",
    fecha: "2026-05-15",
    descripcion:
      "El próximo sábado se celebrará el Día de la Familia en la institución. Se requiere coordinación docente.",
    tipo: "evento",
  },
]);

const getTipoClass = (tipo) => {
  return (
    {
      importante: "bg-red-100 text-red-700",
      recordatorio: "bg-amber-100 text-amber-700",
      evento: "bg-blue-100 text-blue-700",
    }[tipo] || "bg-gray-100 text-gray-700"
  );
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 transition-all duration-300">
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-800">Avisos</h1>
          </div>
        </div>
      </header>

      <div class="p-6 lg:p-8">
        <section class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Avisos Institucionales</h2>
          <p class="text-sm text-gray-500">Comunicados para docentes</p>
        </section>

        <div class="space-y-4">
          <div
            v-for="aviso in avisos"
            :key="aviso.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-bold text-gray-800">{{ aviso.titulo }}</h3>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getTipoClass(aviso.tipo)"
              >
                {{ aviso.tipo }}
              </span>
            </div>
            <p class="text-gray-600 mb-3">{{ aviso.descripcion }}</p>
            <p class="text-sm text-gray-500">{{ aviso.fecha }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
