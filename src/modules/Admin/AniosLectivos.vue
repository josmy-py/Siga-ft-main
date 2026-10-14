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

const seleccionado = computed(() => anios.value.find((a) => a.id === seleccionadoId.value) ?? null);
const ultimoNivel = computed(() => Math.max(0, ...(seleccionado.value?.periodos ?? []).map((p) => p.nivel ?? 0)));

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

const nuevoAnio = () => {
  const siguiente = String(new Date().getFullYear() + 1);
  formAnio.value = { id: null, nombre: siguiente, fecha_inicio: "", fecha_fin: "", cantidad_periodos: 3 };
  erroresAnio.value = {};
};

const editarAnio = () => {
  const a = seleccionado.value;
  formAnio.value = { id: a.id, nombre: a.nombre, fecha_inicio: a.fecha_inicio ?? "", fecha_fin: a.fecha_fin ?? "" };
  erroresAnio.value = {};
};

const guardarAnio = async () => {
  const datos = { ...formAnio.value };
  const id = datos.id;
  delete datos.id;
  if (id) delete datos.cantidad_periodos;

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
  if (!(await confirmar(`¿Activar el año lectivo ${a.nombre}?`, "Solo puede haber un año activo a la vez."))) return;
  await ejecutar(() => anioLectivoService.activar(a.id), "No se pudo activar el año lectivo");
};

const cerrarAnio = async () => {
  const a = seleccionado.value;
  if (!(await confirmar(`¿Cerrar el año lectivo ${a.nombre}?`, "Un año cerrado no puede volver a activarse ni editarse, y sus periodos ya no admiten notas ni conducta."))) return;
  await ejecutar(() => anioLectivoService.cerrar(a.id), "No se pudo cerrar el año lectivo");
};

const eliminarAnio = async () => {
  const a = seleccionado.value;
  if (!(await confirmar(`¿Eliminar el año lectivo ${a.nombre}?`, "Solo se eliminan años inactivos sin secciones, matrículas ni registros académicos."))) return;
  await ejecutar(() => anioLectivoService.eliminar(a.id), "No se pudo eliminar el año lectivo");
};

// ---------- Periodos ----------

const agregarPeriodo = async () => {
  await ejecutar(() => anioLectivoService.agregarPeriodo(seleccionado.value.id), "No se pudo agregar el periodo");
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

const eliminarPeriodo = async (periodo) => {
  if (!(await confirmar(`¿Eliminar ${periodo.nombre}?`, "Solo se elimina el último periodo y si no tiene registros."))) return;
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
          {{ formAnio.id ? `Editar año lectivo ${seleccionado?.nombre}` : "Nuevo año lectivo" }}
        </h2>

        <form class="grid md:grid-cols-4 gap-4" @submit.prevent="guardarAnio">
          <label class="text-sm text-slate-600">
            Nombre
            <input v-model.trim="formAnio.nombre" maxlength="50" :class="entradaInput" required />
            <span v-if="erroresAnio.nombre" class="text-red-600 text-xs">{{ erroresAnio.nombre }}</span>
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

          <label v-if="!formAnio.id" class="text-sm text-slate-600">
            Cantidad de periodos
            <input v-model.number="formAnio.cantidad_periodos" type="number" min="1" max="6" :class="entradaInput" />
            <span v-if="erroresAnio.cantidad_periodos" class="text-red-600 text-xs">{{ erroresAnio.cantidad_periodos }}</span>
          </label>

          <div class="md:col-span-4 flex gap-3 justify-end">
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
              <span class="font-semibold text-slate-800">{{ anio.nombre }}</span>
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
                  Año lectivo {{ seleccionado.nombre }}
                  <span class="ml-2 px-3 py-1 rounded-full text-sm font-medium align-middle" :class="ESTADOS_ANIO[seleccionado.estado]?.clase">
                    {{ ESTADOS_ANIO[seleccionado.estado]?.etiqueta ?? seleccionado.estado }}
                  </span>
                </h2>
                <p class="text-slate-500 mt-1">{{ fecha(seleccionado.fecha_inicio) }} al {{ fecha(seleccionado.fecha_fin) }}</p>
                <p v-if="!seleccionado.fecha_inicio || !seleccionado.fecha_fin" class="text-amber-700 text-sm mt-1">
                  Complete las fechas del año antes de activarlo.
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
              <button v-if="seleccionado.estado !== 'cierre' && (seleccionado.periodos?.length ?? 0) < 6" :disabled="ocupado" @click="agregarPeriodo"
                :class="[botonBase, 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white']">
                <i class="pi pi-plus"></i> Agregar periodo
              </button>
            </div>

            <p v-if="!seleccionado.periodos?.length" class="text-slate-500 text-sm">Este año lectivo no tiene periodos.</p>

            <div class="overflow-x-auto">
              <table v-if="seleccionado.periodos?.length" class="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">N.º</th>
                    <th class="text-left bg-slate-100 px-3 py-2 text-slate-600 font-semibold">Nombre</th>
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
                      <div class="flex flex-wrap gap-2">
                        <template v-if="seleccionado.estado !== 'cierre'">
                          <button :disabled="ocupado" @click="guardarPeriodo(periodo)"
                            :class="[botonBase, 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white']">
                            <i class="pi pi-save"></i> Guardar
                          </button>
                          <button v-if="periodo.nivel === ultimoNivel" :disabled="ocupado" @click="eliminarPeriodo(periodo)"
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
              Las notas y la conducta se registran en los periodos del año activo.
            </p>
          </div>

        </section>
      </div>

    </main>
  </div>
</template>
