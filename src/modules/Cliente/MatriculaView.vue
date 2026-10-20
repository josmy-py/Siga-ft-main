<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { estudianteService } from "../../services/estudianteService";
import { matriculaService, TURNOS } from "../../services/matriculaService";
import { discapacidadService, enfermedadService, especialidadService } from "../../services/catalogoService";
import { erroresCampos, mensajeError } from "../../services/api";

// M6: solicitud de matrícula del encargado (API real). Primero se elige el tipo de
// matrícula (campo `ingreso` de matriculas: Nuevo ingreso o Reingreso) y luego se
// llena la ficha. El grado y el turno elegidos sirven a la dirección para asignar
// la sección (solo se ofrecen turnos con cupo). El medicamento se escribe aquí pero
// se guarda en la tabla enfermedades.
const route = useRoute();
const router = useRouter();

const TIPOS = [
  { valor: "Nuevo ingreso", titulo: "Nuevo Ingreso", texto: "Estudiantes que ingresan por primera vez.", icono: "pi pi-user-plus", color: "text-blue-600" },
  { valor: "Reingreso", titulo: "Antiguo Ingreso", texto: "Estudiantes que continúan en la institución.", icono: "pi pi-sync", color: "text-violet-600" },
];
const MAX_MB = 2;
const IMAGENES = ["image/jpeg", "image/png"];
const DOCUMENTOS = ["application/pdf", "image/jpeg", "image/png"];

const tipo = ref(TIPOS.some((t) => t.valor === route.query.tipo) ? route.query.tipo : "");
const estudiantes = ref([]);
const enfermedades = ref([]);
const discapacidades = ref([]);
const especialidades = ref([]);
const opciones = ref(null);
const cargando = ref(true);
const cargandoOpciones = ref(false);
const enviando = ref(false);
const errores = ref({});
const errorOpciones = ref("");
const fotoUrl = ref(null);
const discapacidadElegida = ref("");

const form = reactive({
  estudiante_id: "",
  nie: "",
  grado_id: "",
  turno: "",
  especialidad_id: "",
  enfermedad_id: "",
  medicamento: "",
  discapacidades: [],
  es_trasladado: false,
  foto: null,
  documento: null,
});

const etiquetaTipo = computed(() => TIPOS.find((t) => t.valor === tipo.value)?.titulo ?? "");
const esNuevo = computed(() => tipo.value === "Nuevo ingreso");
const responsable = computed(() => opciones.value?.responsable ?? null);
const grado = computed(() => opciones.value?.grados?.find((g) => g.id === form.grado_id) ?? null);
const tipoNoCorresponde = computed(() => opciones.value?.ingreso && opciones.value.ingreso !== tipo.value);
// NIE: el encargado lo ingresa en Reingreso o si viene de otra institución; en Nuevo ingreso
// sin traslado lo registra la dirección al aprobar
const nieEditable = computed(() => !esNuevo.value || form.es_trasladado);
// Nivel según el grado (Parvularia, Educación Básica); la especialidad solo aplica en Bachillerato
const esBachillerato = computed(() => grado.value?.nivel === "Bachillerato");
const especialidadFija = computed(() =>
  opciones.value && !opciones.value.especialidad_libre
    ? especialidades.value.find((e) => e.id === opciones.value.especialidad_id)?.nombre ?? null
    : null
);
const turnosGrado = computed(() => grado.value?.turnos ?? []);
// Al elegir la enfermedad se propone su medicamento del catálogo; el encargado lo puede escribir
watch(
  () => form.enfermedad_id,
  (id) => {
    form.medicamento = enfermedades.value.find((e) => e.id === id)?.medicamento ?? "";
  }
);
const discapacidadesElegidas = computed(() => discapacidades.value.filter((d) => form.discapacidades.includes(d.id)));
const puedeEnviar = computed(
  () => opciones.value?.permitido && !tipoNoCorresponde.value && !responsable.value?.falta && !enviando.value
);

onMounted(async () => {
  try {
    const [lista, enf, dis, esp] = await Promise.all([
      estudianteService.listar(),
      enfermedadService.getAll(),
      discapacidadService.getAll(),
      especialidadService.getAll(),
    ]);
    estudiantes.value = lista;
    enfermedades.value = enf.enfermedades ?? [];
    discapacidades.value = dis.discapacidades ?? [];
    especialidades.value = esp.especialidades ?? [];
    if (route.query.estudiante && lista.some((e) => String(e.id) === String(route.query.estudiante))) {
      form.estudiante_id = Number(route.query.estudiante);
    }
  } catch (e) {
    Swal.fire({ icon: "error", title: mensajeError(e, "No se pudieron cargar los datos del formulario.") });
  } finally {
    cargando.value = false;
  }
});

watch(
  () => form.estudiante_id,
  async (id) => {
    opciones.value = null;
    errores.value = {};
    errorOpciones.value = "";
    form.grado_id = "";
    if (!id) return;
    cargandoOpciones.value = true;
    try {
      opciones.value = await matriculaService.opciones(id);
      form.nie = opciones.value.nie ?? "";
      form.especialidad_id = opciones.value.especialidad_libre ? "" : opciones.value.especialidad_id ?? "";
      if (opciones.value.grados.length === 1) form.grado_id = opciones.value.grados[0].id;
    } catch (e) {
      const campos = erroresCampos(e);
      errorOpciones.value = campos.anio_lectivo_id
        ? "La dirección aún no ha activado el año lectivo: por ahora no se reciben solicitudes de matrícula."
        : Object.values(campos)[0] ?? mensajeError(e, "No se pudo consultar la matrícula del estudiante.");
    } finally {
      cargandoOpciones.value = false;
    }
  }
);

watch(
  () => form.grado_id,
  () => {
    form.turno = "";
    if (!esBachillerato.value && opciones.value?.especialidad_libre) form.especialidad_id = "";
  }
);

// Al corregir un campo se quita su aviso
for (const campo of ["nie", "grado_id", "turno", "especialidad_id", "enfermedad_id", "medicamento"]) {
  watch(() => form[campo], () => delete errores.value[campo]);
}

// Sin traslado la documentación deja de ser obligatoria
watch(() => form.es_trasladado, () => delete errores.value.documento);

const elegirTipo = (valor) => {
  tipo.value = valor;
  router.replace({ query: { ...route.query, tipo: valor } });
};

const elegirArchivo = (campo, evento, tipos) => {
  const archivo = evento.target.files?.[0] ?? null;
  delete errores.value[campo];
  if (archivo && !tipos.includes(archivo.type)) {
    errores.value[campo] = campo === "foto" ? "La foto debe ser una imagen JPEG o PNG." : "El documento debe ser PDF, JPEG, PNG o JPG.";
  } else if (archivo && archivo.size > MAX_MB * 1024 * 1024) {
    errores.value[campo] = `El archivo no debe pesar más de ${MAX_MB} MB.`;
  }
  if (errores.value[campo]) {
    evento.target.value = "";
    form[campo] = null;
  } else {
    form[campo] = archivo;
  }
  if (campo === "foto") {
    if (fotoUrl.value) URL.revokeObjectURL(fotoUrl.value);
    fotoUrl.value = form.foto ? URL.createObjectURL(form.foto) : null;
  }
};

const agregarDiscapacidad = () => {
  const id = Number(discapacidadElegida.value);
  if (id && !form.discapacidades.includes(id)) form.discapacidades.push(id);
  discapacidadElegida.value = "";
};
const quitarDiscapacidad = (id) => {
  form.discapacidades = form.discapacidades.filter((d) => d !== id);
};

// Mismas reglas que la API (MatriculaController::store), más grado y turno con cupo
const validar = () => {
  const e = {};
  if (!form.estudiante_id) e.estudiante_id = "El estudiante es obligatorio.";
  if (nieEditable.value) {
    if (!form.nie.trim()) e.nie = "El NIE del estudiante es obligatorio.";
    else if (!/^[0-9]{1,10}$/.test(form.nie.trim())) e.nie = "El NIE debe tener solo números (hasta 10 dígitos).";
  }
  if (!form.grado_id) e.grado_id = "Seleccione el grado a matricular.";
  else if (!turnosGrado.value.length) e.grado_id = "Este grado no tiene secciones con cupo.";
  else if (!form.turno) e.turno = "Seleccione el turno.";
  if (!form.foto) e.foto = errores.value.foto ?? "La foto es obligatoria.";
  if (esNuevo.value && form.es_trasladado && !form.documento) {
    e.documento = errores.value.documento ?? "La documentación es obligatoria si el estudiante proviene de otro centro escolar.";
  }
  errores.value = e;
  return Object.keys(e).length === 0;
};

const enviar = async () => {
  if (!puedeEnviar.value || !validar()) return;
  enviando.value = true;
  try {
    const { message } = await matriculaService.solicitar({
      ingreso: tipo.value,
      estudiante_id: form.estudiante_id,
      nie: nieEditable.value ? form.nie.trim() : null,
      especialidad_id: esBachillerato.value ? form.especialidad_id : opciones.value.especialidad_id ?? "",
      grado_id: form.grado_id,
      turno: form.turno,
      enfermedad_id: form.enfermedad_id,
      medicamento: form.enfermedad_id ? form.medicamento.trim() : "",
      discapacidades: form.discapacidades,
      // Solo Nuevo ingreso pregunta si proviene de otro centro escolar
      es_trasladado: esNuevo.value && form.es_trasladado,
      foto: form.foto,
      documento: esNuevo.value ? form.documento : null,
    });
    await Swal.fire({ icon: "success", title: message });
    router.push({ name: "matricula-cliente" });
  } catch (e) {
    errores.value = erroresCampos(e);
    Swal.fire({ icon: "error", title: Object.values(errores.value)[0] ?? mensajeError(e, "No se pudo registrar la solicitud.") });
  } finally {
    enviando.value = false;
  }
};

const cancelarTodo = () => router.push({ name: "matricula-cliente" });

const claseCampo = (campo) =>
  `w-full border rounded-lg px-3 py-2 text-sm bg-white ${errores.value[campo] ? "border-red-400 bg-red-50" : "border-gray-300"}`;
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Paso 1: tipo de matrícula -->
    <div v-if="!tipo" class="p-6 max-w-4xl">
      <button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100" @click="cancelarTodo">
        <i class="pi pi-arrow-left"></i> Cancelar
      </button>
      <div class="text-center my-8">
        <h1 class="text-2xl font-bold text-gray-800">Tipo de Matrícula</h1>
        <p class="text-gray-500 mt-2">Selecciona el tipo de matrícula que deseas realizar.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          v-for="t in TIPOS"
          :key="t.valor"
          class="flex items-center gap-6 text-left bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition"
          @click="elegirTipo(t.valor)"
        >
          <i :class="[t.icono, t.color]" class="text-3xl"></i>
          <span>
            <span class="block text-xl font-bold text-gray-800">{{ t.titulo }}</span>
            <span class="block text-gray-500 mt-2">{{ t.texto }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Paso 2: ficha de matrícula -->
    <form v-else class="space-y-6" novalidate @submit.prevent="enviar">

      <div v-if="cargando" class="text-gray-500 px-2">Cargando…</div>

      <section v-else class="bg-white rounded-2xl shadow-sm p-6 space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Foto -->
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-36 h-36 rounded-full border border-gray-200 shadow-inner bg-gray-50 flex items-center justify-center overflow-hidden"
              :class="errores.foto ? 'ring-2 ring-red-300' : ''"
            >
              <img v-if="fotoUrl" :src="fotoUrl" alt="Foto" class="w-full h-full object-cover" />
              <div v-else class="text-center text-gray-400">
                <i class="pi pi-camera text-3xl"></i>
                <p class="text-xs mt-1">Sin foto</p>
              </div>
            </div>
            <span class="font-medium text-gray-700">Foto *</span>
            <label class="cursor-pointer text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              Elegir archivo
              <input type="file" accept="image/jpeg,image/png" class="hidden" @change="elegirArchivo('foto', $event, IMAGENES)" />
            </label>
            <span class="text-xs text-gray-500">{{ form.foto?.name ?? "JPEG o PNG, máx. 2 MB" }}</span>
            <p v-if="errores.foto" class="text-red-600 text-xs text-center">{{ errores.foto }}</p>
          </div>

          <!-- Datos académicos -->
          <div class="lg:col-span-2 space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo del estudiante *</label>
                <select v-model="form.estudiante_id" :class="claseCampo('estudiante_id')">
                  <option value="">Seleccione un estudiante registrado…</option>
                  <option v-for="e in estudiantes" :key="e.id" :value="e.id">{{ e.nombre }}</option>
                </select>
                <p v-if="errores.estudiante_id" class="text-red-600 text-xs mt-1">{{ errores.estudiante_id }}</p>
                <p v-if="!estudiantes.length" class="text-xs text-gray-500 mt-1">
                  Primero registre al estudiante en
                  <router-link class="text-blue-600 underline" :to="{ name: 'registro-cliente' }">Registro de Estudiante</router-link>.
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">NIE *</label>
                <input
                  v-if="nieEditable"
                  v-model="form.nie"
                  inputmode="numeric"
                  maxlength="10"
                  placeholder="Solo números"
                  :class="claseCampo('nie')"
                />
                <input v-else value="" disabled placeholder="Lo registra la dirección" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100" />
                <p v-if="errores.nie" class="text-red-600 text-xs mt-1">{{ errores.nie }}</p>
                <p v-if="!nieEditable" class="text-xs text-gray-500 mt-1">En Nuevo ingreso sin traslado, la dirección lo agrega al aprobar.</p>
              </div>
            </div>

            <p v-if="cargandoOpciones" class="text-sm text-gray-500">Consultando…</p>
            <p v-if="errorOpciones" class="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{{ errorOpciones }}</p>
            <div v-if="opciones && (!opciones.permitido || tipoNoCorresponde)" class="bg-red-50 text-red-700 rounded-xl p-3 text-sm">
              <template v-if="!opciones.permitido">{{ opciones.mensaje }}</template>
              <template v-else>
                {{ opciones.mensaje }} Para este estudiante corresponde <b>{{ opciones.ingreso }}</b>.
                <button type="button" class="underline ml-1" @click="elegirTipo(opciones.ingreso)">Cambiar a {{ opciones.ingreso }}</button>
              </template>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Grado a matricular *</label>
                <select v-model="form.grado_id" :disabled="!opciones?.permitido || opciones.grados.length === 1" :class="claseCampo('grado_id')">
                  <option value="">Seleccionar grado</option>
                  <option v-for="g in opciones?.grados ?? []" :key="g.id" :value="g.id">{{ g.nombre }}</option>
                </select>
                <p v-if="errores.grado_id" class="text-red-600 text-xs mt-1">{{ errores.grado_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad / Nivel</label>
                <select v-if="esBachillerato && opciones?.especialidad_libre" v-model="form.especialidad_id" :class="claseCampo('especialidad_id')">
                  <option value="">Bachillerato: seleccione la especialidad</option>
                  <option v-for="e in especialidades" :key="e.id" :value="e.id">Bachillerato · {{ e.nombre }}</option>
                </select>
                <input
                  v-else
                  :value="grado ? (esBachillerato && especialidadFija ? `Bachillerato · ${especialidadFija}` : grado.nivel) : ''"
                  disabled
                  placeholder="Según el grado elegido"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700"
                />
                <p v-if="errores.especialidad_id" class="text-red-600 text-xs mt-1">{{ errores.especialidad_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Turno *</label>
                <select v-model="form.turno" :disabled="!grado" :class="claseCampo('turno')">
                  <option value="">{{ grado ? "Seleccionar turno" : "Seleccione primero el grado" }}</option>
                  <option v-for="t in turnosGrado" :key="t" :value="t">{{ TURNOS[t] ?? t }}</option>
                </select>
                <p v-if="errores.turno" class="text-red-600 text-xs mt-1">{{ errores.turno }}</p>
                <p v-else-if="grado && !turnosGrado.length" class="text-amber-700 text-xs mt-1">
                  {{ grado.nombre }} no tiene secciones con cupo en {{ opciones.anio_lectivo?.anio }}.
                </p>
                <p v-else-if="grado && turnosGrado.length === 1" class="text-gray-500 text-xs mt-1">
                  Solo hay secciones con cupo en el turno de la {{ TURNOS[turnosGrado[0]]?.toLowerCase() }}.
                </p>
              </div>
              <!-- Solo en Reingreso: en Nuevo ingreso nunca repite un grado cursado en la institución -->
              <div v-if="!esNuevo">
                <label class="block text-sm font-medium text-gray-700 mb-1">¿Repite el grado seleccionado?</label>
                <input :value="opciones ? (opciones.repite ? 'Sí, debe repetir' : 'No') : ''" disabled placeholder="Según su último año" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600" />
              </div>
            </div>
            <p class="text-xs text-gray-500">El grado y el turno sirven a la dirección para asignar la sección al revisar la solicitud.</p>

            <!-- Solo en Nuevo ingreso (matriculas.es_trasladado); si proviene de otro centro escolar la documentación es obligatoria -->
            <label v-if="esNuevo" class="flex items-center gap-2 text-sm text-gray-700">
              <input v-model="form.es_trasladado" type="checkbox" class="w-4 h-4" />
              ¿El estudiante proviene de otro centro escolar?
            </label>

            <div v-if="esNuevo">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Documentación{{ form.es_trasladado ? " *" : " (opcional)" }} (PDF, JPEG o PNG, máx. 2 MB)
              </label>
              <input type="file" accept="application/pdf,image/jpeg,image/png" class="text-sm" @change="elegirArchivo('documento', $event, DOCUMENTOS)" />
              <p v-if="errores.documento" class="text-red-600 text-xs mt-1">{{ errores.documento }}</p>
            </div>

            <div v-if="responsable" class="text-sm rounded-xl p-3" :class="responsable.falta ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-700'">
              <template v-if="responsable.falta">
                {{ responsable.falta }}
                <router-link class="underline ml-1" :to="{ name: 'perfil-cliente' }">Ir a Mi perfil</router-link>
              </template>
              <template v-else>
                <b>Responsable:</b> {{ responsable.nombre }} ({{ responsable.parentesco }}, DUI {{ responsable.dui }})
              </template>
              <p v-if="errores.encargado_id" class="text-red-600 text-xs mt-1">{{ errores.encargado_id }}</p>
            </div>
          </div>
        </div>

        <!-- Información de salud -->
        <div class="border-t pt-6">
          <h2 class="font-semibold text-gray-800">Información de Salud</h2>
          <p class="text-xs text-gray-500 mb-4">Si el estudiante no posee ninguna, deje las opciones en blanco.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="min-w-0">
              <label class="block text-sm font-medium text-gray-700 mb-1">Enfermedad principal</label>
              <select v-model="form.enfermedad_id" :class="claseCampo('enfermedad_id')">
                <option value="">Ninguna / Seleccione…</option>
                <option v-for="e in enfermedades" :key="e.id" :value="e.id">{{ e.nombre }}</option>
              </select>
              <p v-if="errores.enfermedad_id" class="text-red-600 text-xs mt-1">{{ errores.enfermedad_id }}</p>
            </div>
            <div class="min-w-0">
              <label class="block text-sm font-medium text-gray-700 mb-1">Discapacidades</label>
              <!-- min-w-0 + shrink-0: el botón no se sale de su columna en pantallas medianas -->
              <div class="flex gap-2 min-w-0">
                <select v-model="discapacidadElegida" class="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Seleccione…</option>
                  <option v-for="d in discapacidades" :key="d.id" :value="d.id" :disabled="form.discapacidades.includes(d.id)">{{ d.nombre }}</option>
                </select>
                <button type="button" class="shrink-0 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700" @click="agregarDiscapacidad">Agregar</button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span v-for="d in discapacidadesElegidas" :key="d.id" class="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                  {{ d.nombre }}
                  <button type="button" class="ml-1" @click="quitarDiscapacidad(d.id)"><i class="pi pi-times text-[10px]"></i></button>
                </span>
              </div>
            </div>
            <div class="min-w-0">
              <label class="block text-sm font-medium text-gray-700 mb-1">Medicamentos frecuentes</label>
              <input
                v-model="form.medicamento"
                maxlength="50"
                :disabled="!form.enfermedad_id"
                :placeholder="form.enfermedad_id ? 'Escriba el medicamento' : 'Seleccione primero la enfermedad'"
                :class="[claseCampo('medicamento'), 'disabled:bg-gray-100']"
              />
              <p v-if="errores.medicamento" class="text-red-600 text-xs mt-1">{{ errores.medicamento }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="flex justify-between">
        <button type="button" class="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100" @click="cancelarTodo">Cancelar Todo</button>
        <button
          type="submit"
          :disabled="!puedeEnviar"
          class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {{ enviando ? "Enviando…" : "Confirmar Matrícula" }} <i class="pi pi-check"></i>
        </button>
      </div>
    </form>
  </div>
</template>
