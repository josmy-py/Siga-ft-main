<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { estudianteService } from "../../services/estudianteService";
import { consultaService } from "../../services/consultaService";
import ComprobanteMatricula from "../../components/ComprobanteMatricula.vue";
import { familiaService } from "../../services/familiaService";
import { erroresCampos, mensajeError } from "../../services/api";

// M5: ficha del estudiante para la dirección (API real): datos, cuenta responsable,
// padres vinculados, matrículas registradas y acciones exclusivas del director.
const props = defineProps({
  estudianteId: { type: Number, required: true },
});
const emit = defineEmits(["cerrar", "cambiado"]);

const alumno = ref(null);
// M11 Consultar expediente: resultado de cada matrícula (nota final y conducta)
const resultados = ref({});
const comprobanteId = ref(null);
const permisos = ref({});
const cargando = ref(true);
const error = ref("");

// D-E4: vínculo autorizado por la dirección
const vinculo = ref({ dui: "", parentesco: "" });
const erroresVinculo = ref({});
const vinculando = ref(false);

const ultima = computed(() => alumno.value?.matriculas?.[0] ?? null);
const ubicacion = computed(() => {
  const d = alumno.value?.distrito;
  return d ? `${d.nombre}, ${d.municipio?.nombre}, ${d.municipio?.departamento?.nombre}` : "—";
});

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const [ficha, expediente] = await Promise.all([
      estudianteService.obtener(props.estudianteId),
      consultaService.expediente(props.estudianteId),
    ]);
    alumno.value = ficha.estudiante;
    permisos.value = ficha.permisos;
    resultados.value = Object.fromEntries(expediente.resultados.map((r) => [r.matricula_id, r]));
  } catch (e) {
    error.value = mensajeError(e, "No se pudo cargar la ficha del estudiante.");
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargar();
});

const exito = (titulo) => Swal.fire({ icon: "success", title: titulo, timer: 2000, showConfirmButton: false });

const vincular = async () => {
  vinculando.value = true;
  erroresVinculo.value = {};
  try {
    const { message } = await familiaService.vincular(props.estudianteId, vinculo.value.dui, vinculo.value.parentesco);
    vinculo.value = { dui: "", parentesco: "" };
    exito(message);
    await cargar();
    emit("cambiado");
  } catch (e) {
    erroresVinculo.value = erroresCampos(e);
    if (!Object.keys(erroresVinculo.value).length) {
      Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo vincular") });
    }
  } finally {
    vinculando.value = false;
  }
};

const quitar = async (padre) => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Quitar el vínculo?",
    text: `${padre.nombre} dejará de figurar como ${padre.pivot?.parentesco?.toLowerCase() ?? "pariente"} de ${alumno.value.nombre}.`,
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  try {
    const { message } = await familiaService.desvincular(props.estudianteId, padre.id);
    exito(message);
    await cargar();
    emit("cambiado");
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo quitar el vínculo") });
  }
};

</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-[#f5f7fb] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">
      <!-- HEADER -->
      <div class="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <i class="pi pi-user text-indigo-600 text-xl"></i>
          <div>
            <h1 class="text-lg font-bold text-gray-800">Ficha del Estudiante</h1>
            <p class="text-sm text-gray-500">Panel de administración escolar</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-xs text-gray-500">NIE</p>
            <p class="font-semibold">{{ alumno?.nie || "Pendiente" }}</p>
          </div>
          <button @click="emit('cerrar')" class="text-gray-500 hover:text-red-500" title="Cerrar">
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>
      </div>

      <div v-if="cargando" class="p-10 text-center text-gray-500">
        <i class="pi pi-spin pi-spinner mr-2"></i>Cargando ficha...
      </div>
      <div v-else-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{{ error }}</div>

      <div v-else class="space-y-6">
        <!-- DATOS -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <i class="pi pi-id-card text-indigo-600"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">{{ alumno.nombre }}</h2>
              <p class="text-sm text-gray-500">
                {{ alumno.genero }} · Nacimiento: {{ alumno.fecha_nacimiento?.slice(0, 10) }} · Estado: {{ alumno.estado }}
              </p>
            </div>
          </div>

          <div class="grid md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-xs text-gray-500">Grado</p>
              <p class="font-semibold">{{ ultima?.seccion?.grado?.nombre || "—" }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-xs text-gray-500">Sección</p>
              <p class="font-semibold">{{ ultima?.seccion?.nombre || "—" }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-xs text-gray-500">Turno</p>
              <p class="font-semibold">{{ ultima?.seccion?.turno || "—" }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-xs text-gray-500">Año lectivo</p>
              <p class="font-semibold">{{ ultima?.anio_lectivo?.nombre || "—" }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-4">
            <i class="pi pi-map-marker mr-1"></i>{{ ubicacion }}<span v-if="alumno.canton"> · Cantón {{ alumno.canton }}</span>
            · {{ alumno.direccion }}
          </p>
        </div>

        <!-- CUENTA RESPONSABLE -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4"><i class="pi pi-user-edit mr-2"></i> Cuenta responsable</h3>
          <p class="text-sm">
            <b>{{ alumno.user?.email || "Sin cuenta" }}</b>
            <span class="text-gray-500"> · {{ alumno.user?.email }}</span>
          </p>
        </div>

        <!-- PADRES -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4"><i class="pi pi-users mr-2"></i> Padre y madre</h3>

          <div class="space-y-3">
            <div v-for="p in alumno.padres" :key="p.id" class="flex flex-wrap justify-between items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div>
                <p class="font-semibold">
                  {{ p.nombre }}
                  <span class="text-xs font-normal text-gray-500">({{ p.pivot?.parentesco }})</span>
                  <span v-if="p.user_id" class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Titular de una cuenta</span>
                </p>
                <p class="text-sm text-gray-500">DUI {{ p.dui }} · {{ p.telefono || "sin teléfono" }} · {{ p.email || "sin correo" }}</p>
              </div>
              <button @click="quitar(p)" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">
                <i class="pi pi-link mr-1"></i> Quitar vínculo
              </button>
            </div>
            <p v-if="!alumno.padres?.length" class="text-sm text-gray-500">No tiene padres vinculados.</p>
          </div>

          <!-- D-E4: vínculo autorizado por la dirección -->
          <form @submit.prevent="vincular" class="mt-5 border-t pt-4">
            <p class="text-sm text-gray-600 mb-3">
              Vincular a una persona ya registrada (por ejemplo, de otra familia). Queda en la bitácora como autorización de la dirección.
            </p>
            <div class="flex flex-wrap gap-3 items-start">
              <div>
                <input v-model="vinculo.dui" placeholder="DUI 00000000-0" class="border p-2 rounded-lg" />
                <p v-if="erroresVinculo.dui" class="text-xs text-red-600 mt-1 max-w-xs">{{ erroresVinculo.dui }}</p>
              </div>
              <div>
                <select v-model="vinculo.parentesco" class="border p-2 rounded-lg">
                  <option value="" disabled>Parentesco</option>
                  <option>Padre</option>
                  <option>Madre</option>
                </select>
                <p v-if="erroresVinculo.parentesco" class="text-xs text-red-600 mt-1 max-w-xs">{{ erroresVinculo.parentesco }}</p>
              </div>
              <button
                type="submit"
                :disabled="vinculando"
                class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                Vincular por DUI
              </button>
            </div>
          </form>
        </div>

        <!-- ENCARGADO Y SALUD (de la última matrícula) -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4"><i class="pi pi-heart mr-2"></i> Encargado y salud (última matrícula)</h3>
          <div v-if="ultima" class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-gray-500">Encargado</p>
              <p class="font-semibold">
                {{ ultima.encargado ? `${ultima.encargado.nombre} (${ultima.encargado.parentesco})` : "Padre o madre" }}
              </p>
            </div>
            <div class="p-4 bg-red-50 rounded-xl">
              <p class="text-gray-500">Enfermedad</p>
              <p>{{ ultima.enfermedad?.nombre || "—" }}<span v-if="ultima.enfermedad?.medicamento"> · {{ ultima.enfermedad.medicamento }}</span></p>
            </div>
            <div class="p-4 bg-yellow-50 rounded-xl">
              <p class="text-gray-500">Discapacidades</p>
              <p>{{ ultima.discapacidades?.map((d) => d.nombre).join(", ") || "—" }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500">Sin matrículas registradas.</p>
        </div>

        <!-- MATRÍCULAS -->
        <div class="bg-white rounded-2xl border shadow-sm p-6">
          <h3 class="font-semibold mb-4"><i class="pi pi-book mr-2"></i> Matrículas</h3>
          <div v-for="m in alumno.matriculas" :key="m.id" class="p-3 bg-gray-50 rounded-xl mb-2 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span>{{ m.anio_lectivo?.nombre || "Sin año" }} · {{ m.seccion?.grado?.nombre || "—" }} {{ m.seccion?.nombre || "" }}</span>
              <span class="flex items-center gap-3">
                <span class="font-semibold">{{ m.estado }}</span>
                <button class="text-blue-600 hover:underline" @click="comprobanteId = m.id">
                  <i class="pi pi-file mr-1"></i>Comprobante
                </button>
              </span>
            </div>
            <p v-if="resultados[m.id]?.nota_final" class="mt-1 text-gray-600">
              Nota final: {{ Number(resultados[m.id].nota_final.promedio_anual).toFixed(2) }} ({{ resultados[m.id].nota_final.estado }})
            </p>
            <p v-for="(c, i) in resultados[m.id]?.conducta ?? []" :key="i" class="mt-1 text-gray-600">
              Conducta {{ c.periodo }}: {{ c.valoracion }} · {{ c.descripcion }}
            </p>
          </div>
          <p v-if="!alumno.matriculas?.length" class="text-sm text-gray-500">Sin matrículas registradas.</p>
        </div>

        <ComprobanteMatricula v-if="comprobanteId" :matricula-id="comprobanteId" @cerrar="comprobanteId = null" />

        <div class="flex justify-end">
          <button
            @click="emit('cerrar')"
            class="bg-gray-100 border border-gray-400 hover:bg-red-50 text-gray-600 hover:text-red-500 px-6 py-2 rounded-xl flex justify-center gap-2"
          >
            <i class="pi pi-times"></i> Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
