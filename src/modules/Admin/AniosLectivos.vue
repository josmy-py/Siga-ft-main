<script setup>
import { computed, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import { anioLectivoService, periodoEscolarService } from "@/services/calendarioService";
import { erroresCampos, mensajeError } from "@/services/api";

const ESTADOS_ANIO = {
  inactivo: { etiqueta: "Inactivo", clase: "bg-amber-100 text-amber-700" },
  activo: { etiqueta: "Activo", clase: "bg-green-100 text-green-700" },
  cierre: { etiqueta: "Cerrado", clase: "bg-slate-200 text-slate-600" },
};

// Estado de cada periodo: nace pendiente; el director lo activa y lo cierra al terminar el trimestre
const ESTADOS_PERIODO = {
  pendiente: { etiqueta: "Pendiente", clase: "bg-amber-100 text-amber-700" },
  activo: { etiqueta: "Activo", clase: "bg-green-100 text-green-700" },
  cerrado: { etiqueta: "Cerrado", clase: "bg-slate-200 text-slate-600" },
};

const anios = ref([]);
const cargando = ref(false);
const errorCarga = ref(null);
const seleccionadoId = ref(null);

const ocupado = ref(false);

// Formulario de año (crear o editar)
const formAnio = ref(null);
const erroresAnio = ref({});

// Edición de periodos: copia por id para no tocar la lista hasta que la API confirme
const edicionPeriodos = ref({});
const erroresPeriodos = ref({});

// Formulario "Agregar periodo": campos del diagrama (nombre y nivel)
const MAX_PERIODOS = 6;
const formPeriodo = ref(null);
const erroresPeriodo = ref({});

const seleccionado = computed(() => anios.value.find((a) => a.id === seleccionadoId.value) ?? null);
const nivelesUsados = computed(() => (seleccionado.value?.periodos ?? []).map((p) => p.nivel));
const nivelesLibres = computed(() =>
  Array.from({ length: MAX_PERIODOS }, (_, i) => i + 1).filter((n) => !nivelesUsados.value.includes(n)),
);

const fecha = (valor) => {
  if (!valor) return "Sin fecha";
  const [a, m, d] = String(valor).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
};

const prepararPeriodos = () => {
  edicionPeriodos.value = Object.fromEntries(
    (seleccionado.value?.periodos ?? []).map((p) => [
      p.id,
      { nombre: p.nombre ?? "" },
    ]),
  );
  erroresPeriodos.value = {};
};

const cargar = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    anios.value = await anioLectivoService.listar();
    if (!anios.value.some((a) => a.id === seleccionadoId.value)) {
      seleccionadoId.value = anios.value[0]?.id ?? null;
    }
    prepararPeriodos();
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los años lectivos");
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

const seleccionar = (anio) => {
  seleccionadoId.value = anio.id;
  formAnio.value = null;
  formPeriodo.value = null;
  prepararPeriodos();
};

const exito = (mensaje) => Swal.fire({ icon: "success", title: mensaje, timer: 2500, showConfirmButton: false });
const fallo = (error, porDefecto) => Swal.fire({ icon: "error", title: mensajeError(error, porDefecto) });

const confirmar = async (titulo, texto) =>
  (
    await Swal.fire({
      icon: "warning",
      title: titulo,
      text: texto,
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    })
  ).isConfirmed;

// Ejecuta una acción; el mensaje de éxito solo aparece si la API la confirmó
const ejecutar = async (accion, porDefecto) => {
  ocupado.value = true;
  try {
    const { message } = await accion();
    await cargar();
    exito(message);
    return true;
  } catch (error) {
    fallo(error, porDefecto);
    // El estado pudo cambiar en otra sesión: se recarga para mostrar el actual
    if (error?.response?.status === 409 || error?.response?.status === 404) await cargar();
    return false;
  } finally {
    ocupado.value = false;
  }
};

// ---------- Años lectivos ----------

// El año lectivo se identifica por su año (campo "anio" del diagrama); los periodos se agregan después
const nuevoAnio = () => {
  formAnio.value = { id: null, anio: new Date().getFullYear() + 1, fecha_inicio: "", fecha_fin: "", inicio_matricula: "", fin_matricula: "" };
  erroresAnio.value = {};
};

const editarAnio = () => {
  const a = seleccionado.value;
  formAnio.value = {
    id: a.id,
    anio: a.anio,
    fecha_inicio: a.fecha_inicio ?? "",
    fecha_fin: a.fecha_fin ?? "",
    inicio_matricula: a.inicio_matricula ?? "",
    fin_matricula: a.fin_matricula ?? "",
  };
  erroresAnio.value = {};
};

const guardarAnio = async () => {
  const datos = { ...formAnio.value };
  const id = datos.id;
  delete datos.id;

  ocupado.value = true;
  erroresAnio.value = {};
  try {
    const respuesta = id ? await anioLectivoService.actualizar(id, datos) : await anioLectivoService.crear(datos);
    formAnio.value = null;
    seleccionadoId.value = respuesta.anio_lectivo?.id ?? seleccionadoId.value;
    await cargar();
    exito(respuesta.message);
  } catch (error) {
    erroresAnio.value = erroresCampos(error);
    fallo(error, id ? "No se pudo actualizar el año lectivo" : "No se pudo crear el año lectivo");
  } finally {
    ocupado.value = false;
  }
};

const activarAnio = async () => {
  const a = seleccionado.value;
  if (!(await confirmar(`¿Activar el año lectivo ${a.anio}?`, "Solo puede haber un año activo a la vez."))) return;
  await ejecutar(() => anioLectivoService.activar(a.id), "No se pudo activar el año lectivo");
};

const cerrarAnio = async () => {
  const a = seleccionado.value;
  if (!(await confirmar(`¿Cerrar el año lectivo ${a.anio}?`, "Un año cerrado no puede volver a activarse ni editarse, y sus periodos ya no admiten notas ni conducta."))) return;
  await ejecutar(() => anioLectivoService.cerrar(a.id), "No se pudo cerrar el año lectivo");
};

const eliminarAnio = async () => {
  const a = seleccionado.value;
  if (!(await confirmar(`¿Eliminar el año lectivo ${a.anio}?`, "Solo se eliminan años inactivos sin secciones, matrículas ni registros académicos."))) return;
  await ejecutar(() => anioLectivoService.eliminar(a.id), "No se pudo eliminar el año lectivo");
};

// ---------- Periodos ----------

const NOMBRES_SUGERIDOS = ["Primer trimestre", "Segundo trimestre", "Tercer trimestre", "Cuarto periodo", "Quinto periodo", "Sexto periodo"];

const abrirFormPeriodo = () => {
  const nivel = nivelesLibres.value[0] ?? 1;
  formPeriodo.value = { nombre: NOMBRES_SUGERIDOS[nivel - 1] ?? "", nivel };
  erroresPeriodo.value = {};
};

const guardarNuevoPeriodo = async () => {
  ocupado.value = true;
  erroresPeriodo.value = {};
  try {
    const { message } = await anioLectivoService.agregarPeriodo(seleccionado.value.id, { ...formPeriodo.value });
    formPeriodo.value = null;
    await cargar();
    exito(message);
  } catch (error) {
    erroresPeriodo.value = erroresCampos(error);
    fallo(error, "No se pudo agregar el periodo");
  } finally {
    ocupado.value = false;
  }
};

const guardarPeriodo = async (periodo) => {
  const datos = { ...edicionPeriodos.value[periodo.id] };

  ocupado.value = true;
  erroresPeriodos.value = { ...erroresPeriodos.value, [periodo.id]: {} };
  try {
    const { message } = await periodoEscolarService.actualizar(periodo.id, datos);
    await cargar();
    exito(message);
  } catch (error) {
    erroresPeriodos.value = { ...erroresPeriodos.value, [periodo.id]: erroresCampos(error) };
    fallo(error, "No se pudo actualizar el periodo");
  } finally {
    ocupado.value = false;
  }
};

const hayPeriodoEnCurso = computed(() => (seleccionado.value?.periodos ?? []).some((p) => p.estado === "activo"));

const CAMBIOS_ESTADO = {
  activo: { pregunta: (p) => `¿Iniciar ${p.nombre}?`, texto: "Queda activo: los docentes registran sus notas y conducta." },
  cerrado: { pregunta: (p) => `¿Cerrar ${p.nombre}?`, texto: "Ya no se podrán registrar ni modificar notas ni conducta en este periodo." },
  pendiente: { pregunta: (p) => `¿Volver ${p.nombre} a pendiente?`, texto: "Úselo si lo inició por error." },
};

const cambiarEstadoPeriodo = async (periodo, estado) => {
  const cambio = CAMBIOS_ESTADO[estado];
  const pregunta = periodo.estado === "cerrado" ? `¿Reabrir ${periodo.nombre}?` : cambio.pregunta(periodo);
  if (!(await confirmar(pregunta, cambio.texto))) return;
  await ejecutar(() => periodoEscolarService.cambiarEstado(periodo.id, estado), "No se pudo cambiar el estado del periodo");
};

const eliminarPeriodo = async (periodo) => {
  if (!(await confirmar(`¿Eliminar ${periodo.nombre}?`, "Solo se elimina si no tiene notas ni conducta registradas."))) return;
  await ejecutar(() => periodoEscolarService.eliminar(periodo.id), "No se pudo eliminar el periodo");
};

const entradaInput = "w-full h-10 px-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 disabled:bg-slate-100";
const botonBase = "flex items-center gap-2 px-3 py-2 rounded-xl border transition disabled:opacity-50 disabled:cursor-not-allowed";
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
    <main class="p-6">
      <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-slate-900">Años lectivos</h1>
          <p class="text-slate-500 mt-2">Años lectivos y sus periodos escolares.</p>
        </div>

        <button
          @click="nuevoAnio"
          :disabled="ocupado"
          class="h-11 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          + Nuevo año lectivo
        </button>
      </header>

      <div v-if="errorCarga" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        {{ errorCarga }}
        <button class="ml-2 underline" @click="cargar">Reintentar</button>
      </div>

      <!-- Formulario de año -->
      <section v-if="formAnio" class="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <h2 class="text-xl font-semibold text-slate-800 mb-4">
          {{ formAnio.id ? `Editar año lectivo ${seleccionado?.anio}` : "Nuevo año lectivo" }}
        </h2>

        <form class="grid md:grid-cols-3 gap-4" @submit.prevent="guardarAnio">
          <label class="text-sm text-slate-600">
            Año
            <input v-model.number="formAnio.anio" type="number" min="2000" max="2100" step="1" placeholder="2027" :class="entradaInput" required />
            <span v-if="erroresAnio.anio" class="text-red-600 text-xs">{{ erroresAnio.anio }}</span>
          </label>

          <label class="text-sm text-slate-600">
            Fecha de inicio
            <input v-model="formAnio.fecha_inicio" type="date" :class="entradaInput" required />
            <span v-if="erroresAnio.fecha_inicio" class="text-red-600 text-xs">{{ erroresAnio.fecha_inicio }}</span>
          </label>

          <label class="text-sm text-slate-600">
            Fecha de fin
            <input v-model="formAnio.fecha_fin" type="date" :class="entradaInput" required />
            <span v-if="erroresAnio.fecha_fin" class="text-red-600 text-xs">{{ erroresAnio.fecha_fin }}</span>
          </label>

          <!-- Periodo en que se pueden solicitar matrículas del año (puede empezar antes del inicio del año) -->
          <label class="text-sm text-slate-600 md:col-start-2">
            Inicio de matrícula
            <input v-model="formAnio.inicio_matricula" type="date" :class="entradaInput" required />
            <span v-if="erroresAnio.inicio_matricula" class="text-red-600 text-xs">{{ erroresAnio.inicio_matricula }}</span>
          </label>

          <label class="text-sm text-slate-600">
            Fin de matrícula
            <input
              v-model="formAnio.fin_matricula"
              type="date"
              :min="formAnio.inicio_matricula || undefined"
              :max="formAnio.fecha_fin || undefined"
              :class="entradaInput"
              required
            />
            <span v-if="erroresAnio.fin_matricula" class="text-red-600 text-xs">{{ erroresAnio.fin_matricula }}</span>
          </label>

          <div class="md:col-span-3 flex gap-3 justify-end">
            <button type="button" class="h-10 px-4 rounded-lg border border-slate-300 hover:bg-slate-100" @click="formAnio = null">
              Cancelar
            </button>
            <button type="submit" :disabled="ocupado" class="h-10 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
              Guardar
            </button>
          </div>
        </form>
      </section>

      <div class="grid lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <!-- Lista de años -->
        <aside class="bg-white rounded-3xl shadow-xl p-4 h-fit min-w-0">
          <p v-if="cargando && !anios.length" class="text-slate-500 text-sm p-2">Cargando años lectivos...</p>
          <p v-else-if="!anios.length && !errorCarga" class="text-slate-500 text-sm p-2">
            No hay años lectivos. Cree el primero con “Nuevo año lectivo”.
          </p>

          <button
            v-for="anio in anios"
            :key="anio.id"
            @click="seleccionar(anio)"
            class="w-full text-left p-3 rounded-xl mb-2 border transition"
            :class="anio.id === seleccionadoId ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-slate-50'"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-slate-800">{{ anio.anio }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="ESTADOS_ANIO[anio.estado]?.clase">
                {{ ESTADOS_ANIO[anio.estado]?.etiqueta ?? anio.estado }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">{{ fecha(anio.fecha_inicio) }} al {{ fecha(anio.fecha_fin) }}</p>
          </button>
        </aside>

        <!-- Detalle -->
        <section v-if="seleccionado" class="lg:col-span-3 xl:col-span-4 space-y-6 min-w-0">
          <div class="bg-white rounded-3xl shadow-xl p-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-bold text-slate-800">
                  Año lectivo {{ seleccionado.anio }}
                  <span class="ml-2 px-3 py-1 rounded-full text-sm font-medium align-middle" :class="ESTADOS_ANIO[seleccionado.estado]?.clase">
                    {{ ESTADOS_ANIO[seleccionado.estado]?.etiqueta ?? seleccionado.estado }}
                  </span>
                </h2>
                <p class="text-slate-500 mt-1">{{ fecha(seleccionado.fecha_inicio) }} al {{ fecha(seleccionado.fecha_fin) }}</p>
                <p class="text-slate-500 text-sm mt-1">
                  Matrícula:
                  <template v-if="seleccionado.inicio_matricula && seleccionado.fin_matricula">
                    {{ fecha(seleccionado.inicio_matricula) }} al {{ fecha(seleccionado.fin_matricula) }}
                    <span
                      class="ml-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="seleccionado.matricula_abierta ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ seleccionado.matricula_abierta ? "Abierta hoy" : "Cerrada hoy" }}
                    </span>
                  </template>
                  <span v-else class="text-amber-700">sin fechas. Edite el año para indicarlas; sin ellas no se admiten matrículas.</span>
                </p>
                <p v-if="!seleccionado.fecha_inicio || !seleccionado.fecha_fin" class="text-amber-700 text-sm mt-1">
                  Complete las fechas del año antes de activarlo.
                </p>
                <p v-if="seleccionado.estado === 'inactivo' && !seleccionado.periodos?.length" class="text-amber-700 text-sm mt-1">
                  Agregue al menos un periodo antes de activarlo.
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <button v-if="seleccionado.estado !== 'cierre'" :disabled="ocupado" @click="editarAnio"
                  :class="[botonBase, 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white']">
                  <i class="pi pi-pencil"></i> Editar
                </button>
                <button v-if="seleccionado.estado === 'inactivo'" :disabled="ocupado" @click="activarAnio"
                  :class="[botonBase, 'border-green-600 text-green-700 hover:bg-green-600 hover:text-white']">
                  <i class="pi pi-play"></i> Activar
                </button>
                <button v-if="seleccionado.estado === 'activo'" :disabled="ocupado" @click="cerrarAnio"
                  :class="[botonBase, 'border-slate-500 text-slate-700 hover:bg-slate-600 hover:text-white']">
                  <i class="pi pi-lock"></i> Cerrar año
                </button>
                <button v-if="seleccionado.estado === 'inactivo'" :disabled="ocupado" @click="eliminarAnio"
                  :class="[botonBase, 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white']">
                  <i class="pi pi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Periodos -->
          <div class="bg-white rounded-3xl shadow-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-slate-800">Periodos</h3>
              <button v-if="seleccionado.estado !== 'cierre' && (seleccionado.periodos?.length ?? 0) < MAX_PERIODOS && !formPeriodo" :disabled="ocupado" @click="abrirFormPeriodo"
                :class="[botonBase, 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white']">
                <i class="pi pi-plus"></i> Agregar periodo
              </button>
            </div>

            <!-- Formulario de periodo -->
            <form v-if="formPeriodo" class="grid md:grid-cols-4 gap-4 mb-5 p-4 rounded-2xl border border-blue-200 bg-blue-50/50" @submit.prevent="guardarNuevoPeriodo">
              <h4 class="md:col-span-4 font-semibold text-slate-700">Nuevo periodo del año {{ seleccionado.anio }}</h4>

              <label class="text-sm text-slate-600 md:col-span-2">
                Nombre del periodo
                <input v-model.trim="formPeriodo.nombre" maxlength="50" placeholder="Primer trimestre" :class="entradaInput" required />
                <span v-if="erroresPeriodo.nombre" class="text-red-600 text-xs">{{ erroresPeriodo.nombre }}</span>
              </label>

              <label class="text-sm text-slate-600">
                Nivel (n.º del periodo)
                <select v-model.number="formPeriodo.nivel" :class="entradaInput" required>
                  <option v-for="n in nivelesLibres" :key="n" :value="n">{{ n }}</option>
                </select>
                <span v-if="erroresPeriodo.nivel" class="text-red-600 text-xs">{{ erroresPeriodo.nivel }}</span>
              </label>

              <label class="text-sm text-slate-600">
                Estado
                <input value="Pendiente" disabled :class="entradaInput" />
                <span class="text-slate-500 text-xs">Todo periodo nuevo queda pendiente.</span>
              </label>

              <div class="md:col-span-4 flex gap-3 justify-end">
                <button type="button" class="h-10 px-4 rounded-lg border border-slate-300 hover:bg-slate-100" @click="formPeriodo = null">
                  Cancelar
                </button>
                <button type="submit" :disabled="ocupado" class="h-10 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                  Guardar periodo
                </button>
              </div>
            </form>

            <p v-if="!seleccionado.periodos?.length" class="text-slate-500 text-sm">Este año lectivo no tiene periodos.</p>

            <div class="overflow-x-auto">
              <table v-if="seleccionado.periodos?.length" class="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">Nivel</th>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">Nombre</th>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">Estado</th>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="periodo in seleccionado.periodos" :key="periodo.id" class="align-top">
                    <td class="px-3 py-3 border-b border-slate-200">{{ periodo.nivel }}</td>

                    <template v-if="seleccionado.estado !== 'cierre' && edicionPeriodos[periodo.id]">
                      <td class="px-3 py-3 border-b border-slate-200">
                        <input v-model.trim="edicionPeriodos[periodo.id].nombre" maxlength="50" :class="[entradaInput, 'min-w-[9rem]']" />
                        <span v-if="erroresPeriodos[periodo.id]?.nombre" class="text-red-600 text-xs">{{ erroresPeriodos[periodo.id].nombre }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-3 py-3 border-b border-slate-200">{{ periodo.nombre }}</td>
                    </template>

                    <td class="px-3 py-3 border-b border-slate-200">
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" :class="ESTADOS_PERIODO[periodo.estado]?.clase">
                        {{ ESTADOS_PERIODO[periodo.estado]?.etiqueta ?? periodo.estado }}
                      </span>
                    </td>

                    <td class="px-3 py-3 border-b border-slate-200">
                      <div class="flex flex-wrap gap-2">
                        <!-- Estado: solo con el año activo y un periodo activo a la vez -->
                        <template v-if="seleccionado.estado === 'activo'">
                          <button v-if="periodo.estado !== 'activo' && !hayPeriodoEnCurso" :disabled="ocupado" @click="cambiarEstadoPeriodo(periodo, 'activo')"
                            :class="[botonBase, 'border-green-600 text-green-700 hover:bg-green-600 hover:text-white']">
                            <i :class="periodo.estado === 'cerrado' ? 'pi pi-replay' : 'pi pi-play'"></i>
                            {{ periodo.estado === "cerrado" ? "Reabrir" : "Iniciar" }}
                          </button>
                          <template v-if="periodo.estado === 'activo'">
                            <button :disabled="ocupado" @click="cambiarEstadoPeriodo(periodo, 'cerrado')"
                              :class="[botonBase, 'border-slate-500 text-slate-700 hover:bg-slate-600 hover:text-white']">
                              <i class="pi pi-lock"></i> Cerrar
                            </button>
                            <button :disabled="ocupado" @click="cambiarEstadoPeriodo(periodo, 'pendiente')" title="Volver a pendiente"
                              :class="[botonBase, 'border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white']">
                              <i class="pi pi-undo"></i>
                            </button>
                          </template>
                        </template>
                        <template v-if="seleccionado.estado !== 'cierre'">
                          <button :disabled="ocupado" @click="guardarPeriodo(periodo)"
                            :class="[botonBase, 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white']">
                            <i class="pi pi-save"></i> Guardar
                          </button>
                          <button v-if="periodo.estado === 'pendiente'" :disabled="ocupado" @click="eliminarPeriodo(periodo)"
                            :class="[botonBase, 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white']">
                            <i class="pi pi-trash"></i>
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="text-xs text-slate-500 mt-3">
              Las notas y la conducta se registran en los periodos del año activo que no estén cerrados.
              El año lectivo se cierra cuando todos sus periodos están cerrados.
            </p>
          </div>

        </section>
      </div>

    </main>
  </div>
</template>
