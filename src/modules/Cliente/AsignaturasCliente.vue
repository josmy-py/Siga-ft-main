<script setup>
import { onMounted, ref, watch } from "vue";
import { estudianteService } from "../../services/estudianteService";
import { consultaService } from "../../services/consultaService";
import { mensajeError } from "../../services/api";

// Asignaturas del estudiante: materias de la sección de su matrícula aprobada.
// El filtro muestra solo los estudiantes de la cuenta con matrícula aprobada.
const hijos = ref([]);
const estudianteId = ref("");
const matriculaId = ref("");
const datos = ref(null);
const cargando = ref(true);
const error = ref("");

const cargar = async () => {
  datos.value = null;
  if (!estudianteId.value) return;
  cargando.value = true;
  error.value = "";
  try {
    datos.value = await consultaService.asignaturas(estudianteId.value, matriculaId.value || null);
    matriculaId.value = datos.value.matricula?.id ?? "";
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron consultar las asignaturas.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  try {
    hijos.value = await estudianteService.listar({ con_matricula_aprobada: 1 });
    estudianteId.value = hijos.value[0]?.id ?? "";
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar sus estudiantes.");
  } finally {
    cargando.value = false;
  }
});

watch(estudianteId, () => {
  matriculaId.value = "";
  cargar();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Asignaturas</h1>
          <p class="text-gray-500 text-sm">Materias y docentes de la sección de su estudiante.</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <select v-model="estudianteId" class="border rounded-lg px-3 py-2 sm:w-64">
            <option v-if="!hijos.length" value="">Sin estudiantes con matrícula aprobada</option>
            <option v-for="h in hijos" :key="h.id" :value="h.id">{{ h.nombre }}</option>
          </select>
          <select v-if="datos?.matriculas?.length > 1" v-model="matriculaId" class="border rounded-lg px-3 py-2" @change="cargar">
            <option v-for="m in datos.matriculas" :key="m.id" :value="m.id">{{ m.anio }} · {{ m.grado }} {{ m.seccion }}</option>
          </select>
        </div>
      </div>
    </header>

    <div class="p-6">
      <p v-if="cargando" class="text-gray-500">Cargando…</p>
      <p v-else-if="error" class="text-red-600">{{ error }}</p>
      <template v-else-if="datos">
        <p class="text-sm text-gray-600 mb-4" v-if="datos.matriculas?.length">
          {{ datos.matriculas.find((m) => m.id === datos.matricula?.id)?.grado }}
          {{ datos.matriculas.find((m) => m.id === datos.matricula?.id)?.seccion }} ·
          Año {{ datos.matriculas.find((m) => m.id === datos.matricula?.id)?.anio }}
        </p>
        <div class="bg-white rounded-xl shadow overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-left text-gray-600">
              <tr><th class="p-3">Asignatura</th><th class="p-3">Docente</th></tr>
            </thead>
            <tbody>
              <tr v-for="a in datos.asignaturas" :key="a.asignacion_id" class="border-t">
                <td class="p-3 font-medium">{{ a.asignatura }}</td>
                <td class="p-3">{{ a.docente || "—" }}</td>
              </tr>
              <tr v-if="!datos.asignaturas.length">
                <td colspan="2" class="p-4 text-gray-500">La sección aún no tiene asignaturas asignadas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
