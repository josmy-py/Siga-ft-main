<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { constanciaService } from "@/services/constanciaService";
import { fechaLegible, hoy } from "@/components/reportes/documentoReporte";

// Portal director > Constancias > Constancia de Buena Conducta (diseño de PDF de
// Josmy, 21/10/2026; sin validaciones de bachillerato). Al buscar el NIE se llena
// el nombre y se listan los años lectivos de sus matrículas aprobadas; se elige el
// que lleva la constancia. El backend genera el PDF con dompdf. No se guarda nada;
// la fecha es solo de lectura: la constancia lleva la del día en que se genera.
const emit = defineEmits(["cerrar"]);
const fechaHoy = fechaLegible(hoy());

const nie = ref("");
const anioLectivo = ref("");
// Mismo director que imprime la libreta de notas; se puede cambiar
const director = ref("Lic. Rolando Alexander Hernandez Peñate");
const estudiante = ref(null);
const buscando = ref(false);
const generando = ref(false);
const aviso = ref("");
let nieBuscado = "";

const mensaje = (e, porDefecto) =>
  Object.values(e.response?.data?.errors ?? {})[0]?.[0] ?? e.response?.data?.message ?? porDefecto;

const buscar = async () => {
  const valor = nie.value.trim();
  if (!valor || valor === nieBuscado) return;
  nieBuscado = valor;
  estudiante.value = null;
  anioLectivo.value = "";
  aviso.value = "";
  buscando.value = true;
  try {
    estudiante.value = await constanciaService.conducta(valor);
    anioLectivo.value = estudiante.value.anios[0] ?? "";
  } catch (e) {
    aviso.value = mensaje(e, "No se pudo buscar el estudiante.");
  } finally {
    buscando.value = false;
  }
};

// Al cambiar el NIE se borran los datos del estudiante anterior
const nieCambiado = () => {
  if (nie.value.trim() !== nieBuscado) {
    estudiante.value = null;
    anioLectivo.value = "";
    aviso.value = "";
    nieBuscado = "";
  }
};

// Mensaje de error de una respuesta pedida como blob (422, 404, 409...)
const errorDeBlob = async (e) => {
  try {
    const cuerpo = JSON.parse(await e.response.data.text());
    return Object.values(cuerpo.errors ?? {})[0]?.[0] ?? cuerpo.message;
  } catch {
    return null;
  }
};

const generar = async () => {
  generando.value = true;
  try {
    const pdf = await constanciaService.conductaPdf({
      nie: estudiante.value.nie,
      anio_lectivo: anioLectivo.value,
      director: director.value,
    });
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) {
    Swal.fire({ icon: "error", title: (await errorDeBlob(e)) ?? "No se pudo generar la constancia." });
  } finally {
    generando.value = false;
  }
};

const entrada =
  "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400";
const soloLectura = `${entrada} bg-gray-50 text-gray-700`;
const subtitulo = "text-lg font-semibold text-gray-700 mt-8 mb-3";
const etiqueta = "block text-xs text-gray-500 mb-1";
</script>

<template>
  <div>
    <form class="bg-white rounded-2xl shadow-sm p-6" @submit.prevent="generar">
      <h1 class="text-xl font-semibold text-gray-800">Crear Constancia de Buena Conducta</h1>
      <p class="mt-2 text-sm text-gray-500">Complete la información necesaria para generar la constancia.</p>

      <h3 :class="subtitulo">Información del Estudiante</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">NIE del estudiante</span>
          <div class="flex gap-2">
            <input
              v-model="nie"
              :class="entrada"
              maxlength="10"
              placeholder="Ingrese el NIE"
              required
              @input="nieCambiado"
              @keydown.enter.prevent="buscar"
              @blur="buscar"
            />
            <button
              type="button"
              class="px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              :disabled="!nie.trim() || buscando"
              title="Buscar estudiante"
              @click="buscar"
            >
              <i :class="['pi', buscando ? 'pi-spin pi-spinner' : 'pi-search']"></i>
            </button>
          </div>
        </label>
        <label class="block">
          <span :class="etiqueta">Nombre Completo</span>
          <input :value="estudiante?.nombre ?? ''" :class="soloLectura" placeholder="Se llena al buscar el NIE" readonly />
        </label>
      </div>
      <p v-if="aviso" class="mt-2 text-xs text-amber-700">{{ aviso }}</p>
      <p v-else class="mt-2 text-xs text-gray-500">Estudiantes registrados con al menos una matrícula aprobada.</p>

      <h3 :class="subtitulo">Información Académica</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span :class="etiqueta">Año Lectivo</span>
          <select v-model="anioLectivo" :class="estudiante ? entrada : soloLectura" :disabled="!estudiante" required>
            <option value="" disabled>{{ estudiante ? "Seleccione" : "Se llena al buscar el NIE" }}</option>
            <option v-for="a in estudiante?.anios ?? []" :key="a" :value="a">{{ a }}</option>
          </select>
        </label>
      </div>

      <h3 :class="subtitulo">Emisión</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span :class="etiqueta">Fecha</span>
          <input :value="fechaHoy" :class="soloLectura" readonly title="La constancia lleva la fecha del día en que se genera" />
        </label>
        <label class="block">
          <span :class="etiqueta">Director(a)</span>
          <input v-model.trim="director" :class="entrada" maxlength="100" placeholder="Nombre del director(a)" required />
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200" @click="emit('cerrar')">
          Cancelar
        </button>
        <button type="submit" :disabled="!estudiante || !anioLectivo || generando" class="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
          <i :class="['pi mr-2', generando ? 'pi-spin pi-spinner' : 'pi-file-pdf']"></i>Generar Constancia
        </button>
      </div>
    </form>
  </div>
</template>
