<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import { matriculaService, TURNOS } from "@/services/matriculaService";
import { anioLectivoService } from "@/services/calendarioService";
import { erroresCampos, mensajeError } from "@/services/api";

// M6: revisión de matrículas por la dirección (API real). El responsable ya
// indicó grado y turno en la solicitud: la dirección solo asigna la sección
// (de ese grado y turno, con cupo).
const ESTADOS = [
  { valor: "pendiente", texto: "Pendientes", color: "blue" },
  { valor: "aprobado", texto: "Aprobadas", color: "green" },
  { valor: "rechazado", texto: "Rechazadas", color: "red" },
];

const estado = ref("pendiente");
const q = ref("");
// Filtro por año lectivo de la matrícula ("" = todos los años)
const anios = ref([]);
const anioId = ref("");
const matriculas = ref([]);
const resumen = ref({ pendiente: 0, aprobado: 0, rechazado: 0 });
const cargando = ref(false);
const error = ref("");

const detalle = ref(null);
const fotoUrl = ref(null);
const asignacion = ref(null);
const seccionId = ref("");
const errorSeccion = ref("");
const nie = ref("");
const errorNie = ref("");
// Nuevo ingreso sin traslado: el estudiante llega sin NIE y la dirección lo agrega al aprobar
const pideNie = computed(() => detalle.value?.estado === "pendiente" && !detalle.value?.estudiante?.nie);
const procesando = ref(false);

const cargar = async () => {
  cargando.value = true;
  error.value = "";
  try {
    const datos = await matriculaService.listar({ estado: estado.value, q: q.value.trim(), anio_lectivo_id: anioId.value });
    matriculas.value = datos.matriculas;
    resumen.value = datos.resumen;
  } catch (e) {
    error.value = mensajeError(e, "No se pudieron cargar las matrículas.");
  } finally {
    cargando.value = false;
  }
};

onMounted(async () => {
  cargar();
  try {
    anios.value = await anioLectivoService.listar();
  } catch {
    anios.value = [];
  }
});
watch([estado, anioId], cargar);

let espera = null;
watch(q, () => {
  clearTimeout(espera);
  espera = setTimeout(cargar, 350);
});

// Secciones con cupo. Con grado y turno pedidos, el API ya devuelve solo esas;
// en solicitudes antiguas sin grado ni turno, la opción los indica
const secciones = computed(() =>
  (asignacion.value?.grados ?? []).flatMap((g) =>
    g.turnos.flatMap((t) =>
      t.secciones.map((s) => ({
        ...s,
        texto: detalle.value?.seccion ? s.nombre : `${g.nombre} · ${TURNOS[t.turno] ?? t.turno} · ${s.nombre}`,
      })),
    ),
  ),
);
watch(seccionId, () => {
  errorSeccion.value = "";
});

// Lugar de nacimiento: distrito, municipio y departamento del estudiante
const lugarNacimiento = computed(() => {
  const d = detalle.value?.estudiante?.distrito;
  return d ? `${d.nombre}, ${d.municipio?.nombre}, ${d.municipio?.departamento?.nombre}` : "—";
});

const abrir = async (m) => {
  try {
    detalle.value = await matriculaService.obtener(m.id);
    asignacion.value = null;
    seccionId.value = "";
    errorSeccion.value = "";
    nie.value = "";
    errorNie.value = "";
    fotoUrl.value = detalle.value.archivos?.foto ? await matriculaService.archivo(m.id, "foto").catch(() => null) : null;
    if (detalle.value.estado === "pendiente") {
      asignacion.value = await matriculaService.seccionesParaAsignar(m.id);
      // La sección propuesta al enviar la solicitud queda elegida; si hay una sola, también
      const pedida = detalle.value.seccion;
      if (pedida && secciones.value.some((s) => s.id === pedida.id)) seccionId.value = pedida.id;
      else if (secciones.value.length === 1) seccionId.value = secciones.value[0].id;
    }
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo abrir la matrícula.") });
  }
};

const cerrar = () => {
  if (fotoUrl.value) URL.revokeObjectURL(fotoUrl.value);
  fotoUrl.value = null;
  detalle.value = null;
};

const aprobar = async () => {
  errorNie.value = "";
  if (pideNie.value && !/^[0-9]{1,10}$/.test(nie.value.trim())) {
    errorNie.value = nie.value.trim() ? "El NIE debe tener solo números (hasta 10 dígitos)." : "Ingrese el NIE del estudiante para aprobar la matrícula.";
  }
  if (!seccionId.value) {
    errorSeccion.value = "Seleccione la sección antes de aprobar.";
  }
  if (errorNie.value || !seccionId.value) return;
  procesando.value = true;
  try {
    const { message } = await matriculaService.aprobar(detalle.value.id, seccionId.value, pideNie.value ? nie.value.trim() : null);
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
    cerrar();
    await cargar();
  } catch (e) {
    const campos = erroresCampos(e);
    errorNie.value = campos.nie ?? "";
    errorSeccion.value = campos.nie ? "" : Object.values(campos)[0] ?? "";
    Swal.fire({ icon: "error", title: Object.values(campos)[0] || mensajeError(e, "No se pudo aprobar.") });
  } finally {
    procesando.value = false;
  }
};

const rechazar = async () => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    title: "¿Rechazar la matrícula?",
    text: `Solicitud de ${detalle.value.estudiante?.nombre}.`,
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
  });
  if (!isConfirmed) return;
  procesando.value = true;
  try {
    const { message } = await matriculaService.rechazar(detalle.value.id);
    Swal.fire({ icon: "success", title: message, timer: 2000, showConfirmButton: false });
    cerrar();
    await cargar();
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudo rechazar.") });
  } finally {
    procesando.value = false;
  }
};

const fecha = (valor) => (valor ? new Date(valor).toLocaleDateString("es-SV") : "—");
</script>

<template>
  <div class="relative min-h-screen bg-gray-50 md:flex">
    <main class="flex-1 min-w-0 transition-all duration-300">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-2">
      <h1 class="text-xl font-bold text-gray-800">Matrículas</h1>
      <p class="text-xs text-gray-500">El encargado envía la solicitud; la dirección asigna la sección y la aprueba o rechaza.</p>
      </div>
    </header>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        <button
          v-for="e in ESTADOS"
          :key="e.valor"
          class="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all"
          :class="estado === e.valor ? 'ring-2 ring-blue-400' : ''"
          @click="estado = e.valor"
        >
          <span class="font-medium text-gray-700">{{ e.texto }}</span>
          <span class="bg-gray-100 px-2 py-1 rounded-full text-sm">{{ resumen[e.valor] ?? 0 }}</span>
        </button>
      </div>

      <div class="px-6">
        <div class="flex flex-wrap gap-3 mb-4">
          <input v-model="q" placeholder="Buscar por nombre o NIE" class="w-full md:w-80 border rounded-lg px-3 py-2" />
          <select v-model="anioId" class="w-full md:w-56 border rounded-lg px-3 py-2 bg-white" aria-label="Año lectivo">
            <option value="">Todos los años</option>
            <option v-for="a in anios" :key="a.id" :value="a.id">Año {{ a.anio }}</option>
          </select>
        </div>
        <p v-if="error" class="text-red-600">{{ error }}</p>

        <div class="bg-white rounded-xl shadow overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th class="p-3">Estudiante</th>
                <th class="p-3">NIE</th>
                <th class="p-3">Ingreso</th>
                <th class="p-3">Año</th>
                <th class="p-3">Grado y sección</th>
                <th class="p-3">Fecha</th>
                <th class="p-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cargando"><td colspan="7" class="p-4 text-gray-500">Cargando…</td></tr>
              <tr v-else-if="!matriculas.length"><td colspan="7" class="p-4 text-gray-500">No hay matrículas en este estado{{ anioId ? " para el año elegido" : "" }}.</td></tr>
              <tr v-for="m in matriculas" :key="m.id" class="border-t">
                <td class="p-3 font-medium">{{ m.estudiante?.nombre }}</td>
                <td class="p-3">{{ m.estudiante?.nie || "—" }}</td>
                <td class="p-3">{{ m.ingreso }}</td>
                <td class="p-3">{{ m.anio_lectivo?.anio || "—" }}</td>
                <td class="p-3">
                  <template v-if="m.seccion && m.estado === 'pendiente'">Pide {{ m.seccion.grado?.nombre }} · {{ TURNOS[m.seccion.turno] }}</template>
                  <template v-else-if="m.seccion">{{ m.seccion.grado?.nombre }} {{ m.seccion.nombre }} · {{ TURNOS[m.seccion.turno] }}</template>
                  <span v-else class="text-amber-600">Sin asignar</span>
                </td>
                <td class="p-3">{{ fecha(m.created_at) }}</td>
                <td class="p-3 text-right">
                  <button class="px-3 py-1.5 rounded-lg border hover:bg-gray-100" @click="abrir(m)">
                    {{ m.estado === "pendiente" ? "Revisar" : "Ver" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Detalle y asignación -->
    <div v-if="detalle" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ detalle.estudiante?.nombre }}</h2>
            <p class="text-sm text-gray-500">
              {{ detalle.ingreso }} · {{ detalle.anio_lectivo?.anio }} · Estado: {{ detalle.estado }}
            </p>
          </div>
          <button class="p-2 hover:bg-gray-100 rounded-full" @click="cerrar"><i class="pi pi-times"></i></button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <img v-if="fotoUrl" :src="fotoUrl" alt="Foto" class="h-32 w-32 object-cover rounded-xl" />
          <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <span><b>NIE:</b> {{ detalle.estudiante?.nie || "—" }}</span>
            <span><b>Nacimiento:</b> {{ detalle.estudiante?.fecha_nacimiento }}</span>
            <span class="sm:col-span-2"><b>Lugar de nacimiento:</b> {{ lugarNacimiento }}</span>
            <span class="sm:col-span-2">
              <b>Dirección:</b> {{ detalle.estudiante?.direccion || "—" }}<template v-if="detalle.estudiante?.canton">, cantón {{ detalle.estudiante.canton }}</template>
            </span>
            <span class="sm:col-span-2"><b>Correo:</b> {{ detalle.estudiante?.user?.email || "—" }}</span>
            <span><b>Género:</b> {{ detalle.estudiante?.genero }}</span>
            <span><b>Trasladado:</b> {{ detalle.es_trasladado ? "Sí" : "No" }}</span>
            <span><b>Especialidad:</b> {{ detalle.especialidad?.nombre || "—" }}</span>
            <span><b>Enfermedad:</b> {{ detalle.enfermedad?.nombre || "Ninguna" }}</span>
            <span class="sm:col-span-2"><b>Discapacidades:</b> {{ detalle.discapacidades?.map((d) => d.nombre).join(", ") || "Ninguna" }}</span>
            <span class="sm:col-span-2">
              <b>Responsable:</b>
              <template v-if="detalle.responsable">
                {{ detalle.responsable.nombre }} ({{ detalle.responsable.parentesco }}, DUI {{ detalle.responsable.dui }})
              </template>
              <span v-else class="text-red-600">Sin responsable registrado</span>
            </span>
          </div>
        </div>

        <div v-if="detalle.estado !== 'pendiente'" class="text-sm bg-gray-50 rounded-xl p-4">
          <b>Sección:</b>
          <template v-if="detalle.seccion">{{ detalle.seccion.grado?.nombre }} {{ detalle.seccion.nombre }} · {{ TURNOS[detalle.seccion.turno] }}</template>
          <template v-else>—</template>
        </div>

        <div v-else-if="asignacion" class="bg-blue-50 rounded-xl p-4 space-y-3">
          <h3 class="font-semibold text-gray-800">Asignar sección</h3>
          <p v-if="detalle.seccion" class="text-sm text-gray-700">
            Grado <b>{{ detalle.seccion.grado?.nombre }}</b>, turno <b>{{ TURNOS[detalle.seccion.turno]?.toLowerCase() }}</b> (lo indicó el responsable).
          </p>
          <p v-else class="text-sm text-gray-600">{{ asignacion.mensaje }}</p>
          <p v-if="!secciones.length" class="text-sm text-red-600">
            No hay secciones con cupo para este estudiante. Solo puede rechazar o ampliar los cupos en Secciones.
          </p>
          <div v-else class="text-sm md:w-1/2">
            <label class="block font-medium mb-1">Sección</label>
            <select v-model="seccionId" class="w-full border rounded-lg px-3 py-2 bg-white">
              <option value="">Seleccione…</option>
              <option v-for="s in secciones" :key="s.id" :value="s.id">
                {{ s.texto }} ({{ s.cupos_disponibles }} de {{ s.capacidad }} cupos)
              </option>
            </select>
          </div>
          <p v-if="errorSeccion" class="text-sm text-red-600">{{ errorSeccion }}</p>
          <div v-if="pideNie" class="text-sm md:w-1/3">
            <label class="block font-medium mb-1">NIE del estudiante *</label>
            <input v-model="nie" inputmode="numeric" maxlength="10" placeholder="Solo números" class="w-full border rounded-lg px-3 py-2 bg-white" />
            <p class="text-xs text-gray-500 mt-1">Nuevo ingreso sin traslado: la dirección registra el NIE.</p>
            <p v-if="errorNie" class="text-red-600 text-xs mt-1">{{ errorNie }}</p>
          </div>
        </div>

        <div v-if="detalle.estado === 'pendiente'" class="flex justify-end gap-3">
          <button :disabled="procesando" class="px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50" @click="rechazar">
            Rechazar
          </button>
          <button
            :disabled="procesando || !secciones.length"
            class="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            @click="aprobar"
          >
            Aprobar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
