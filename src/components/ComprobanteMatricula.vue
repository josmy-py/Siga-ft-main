<script setup>
import { onMounted, ref } from "vue";
import { consultaService } from "../services/consultaService";

// M11: Matricula.generarComprobante(), en una ventana lista para imprimir
const props = defineProps({
  matriculaId: { type: Number, required: true },
});
const emit = defineEmits(["cerrar"]);

const comprobante = ref(null);
const error = ref("");

const imprimir = () => window.print();

const estados = { pendiente: "Pendiente", aprobado: "Aprobada", rechazado: "Rechazada" };

onMounted(async () => {
  try {
    comprobante.value = await consultaService.comprobante(props.matriculaId);
  } catch (e) {
    error.value = e.response?.data?.message ?? "No se pudo generar el comprobante.";
  }
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:static print:bg-white" @click.self="emit('cerrar')">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl print:shadow-none">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-else-if="!comprobante" class="text-sm text-gray-500"><i class="pi pi-spin pi-spinner mr-2"></i>Generando...</p>

      <div v-else>
        <h2 class="text-lg font-bold text-gray-800">Comprobante de matrícula</h2>
        <p class="text-sm text-gray-500 mb-4">N.º {{ comprobante.comprobante }} · {{ comprobante.fecha }}</p>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between"><dt class="text-gray-500">Estudiante</dt><dd class="font-medium">{{ comprobante.estudiante?.nombre }}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">NIE</dt><dd class="font-medium">{{ comprobante.estudiante?.nie || "—" }}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Año lectivo</dt><dd class="font-medium">{{ comprobante.anio || "—" }}</dd></div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Grado y sección</dt>
            <dd class="font-medium">{{ comprobante.grado || "—" }} {{ comprobante.seccion || "" }}</dd>
          </div>
          <div class="flex justify-between"><dt class="text-gray-500">Turno</dt><dd class="font-medium capitalize">{{ comprobante.turno || "—" }}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Especialidad</dt><dd class="font-medium">{{ comprobante.especialidad || "—" }}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Ingreso</dt><dd class="font-medium">{{ comprobante.ingreso }}</dd></div>
          <div class="flex justify-between">
            <dt class="text-gray-500">Responsable</dt>
            <dd class="font-medium">
              {{ comprobante.encargado ? `${comprobante.encargado.nombre} (${comprobante.encargado.parentesco})` : "Padre o madre" }}
            </dd>
          </div>
          <div class="flex justify-between"><dt class="text-gray-500">Estado</dt><dd class="font-semibold">{{ estados[comprobante.estado] ?? comprobante.estado }}</dd></div>
        </dl>
      </div>

      <div class="mt-6 flex justify-end gap-2 print:hidden">
        <button v-if="comprobante" class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" @click="imprimir">
          <i class="pi pi-print mr-1"></i>Imprimir
        </button>
        <button class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200" @click="emit('cerrar')">Cerrar</button>
      </div>
    </div>
  </div>
</template>
