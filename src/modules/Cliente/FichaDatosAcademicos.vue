<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMatriculaStore } from "@/stores/matricula";

const matriculaStore = useMatriculaStore();
const {
  estudiante,
  fotoPreview,
  estudianteSeleccionado,
  certificadoEstudiante,
  salud,
  gradoSelected,
  turnoSelected,
  repiteGrado,
  grados,
  turnos,
  enfermedades,
  discapacidades,
  medicamentos,
  especialidadSelected,
  esNuevoIngreso,
  esAntiguoIngreso,
} = storeToRefs(matriculaStore);

// Estado para controlar la visibilidad del certificado según el checkbox
const provieneOtroCentro = ref(false);

const manejarCambioCentro = () => {
  if (!provieneOtroCentro.value) {
    certificadoEstudiante.value = null;
    estudiante.value.NIE = "";
  }
};

// --- NUEVO: Computado para manejar la enfermedad única como combobox ---
const enfermedadPrincipal = computed({
  get: () => salud.value.enfermedades.length > 0 ? salud.value.enfermedades[0] : "",
  set: (val) => {
    if (val) {
      salud.value.enfermedades = [val]; // Lo guarda como array de 1 elemento para Laravel
    } else {
      salud.value.enfermedades = [];
    }
  }
});

// Variables temporales para discapacidades y medicamentos
const tempDiscapacidad = ref("");
const tempMedicamento = ref("");

const agregarSalud = (tipo) => {
  if (tipo === "discapacidad" && tempDiscapacidad.value) {
    if (!salud.value.discapacidades.includes(tempDiscapacidad.value)) {
      salud.value.discapacidades.push(tempDiscapacidad.value);
    }
    tempDiscapacidad.value = "";
  } else if (tipo === "medicamento" && tempMedicamento.value) {
    if (!salud.value.medicamentos.includes(tempMedicamento.value)) {
      salud.value.medicamentos.push(tempMedicamento.value);
    }
    tempMedicamento.value = "";
  }
};

const eliminarSalud = (tipo, id) => {
  if (tipo === "discapacidad") {
    salud.value.discapacidades = salud.value.discapacidades.filter((item) => item !== id);
  } else if (tipo === "medicamento") {
    salud.value.medicamentos = salud.value.medicamentos.filter((item) => item !== id);
  }
};
</script>

<template>
  <div>
    <!-- BLOQUE 1: NUEVO INGRESO -->
    <div v-if="esNuevoIngreso" class="animate-fade-in mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Foto -->
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
          >
            <img
              v-if="fotoPreview || estudianteSeleccionado?.foto"
              :src="fotoPreview || estudianteSeleccionado?.foto"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 flex-col">
              <i class="pi pi-camera text-4xl mb-2 text-gray-300"></i>
              <span class="text-xs text-gray-400">Sin foto</span>
            </div>
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto</label>
            <input
              type="file"
              accept="image/*"
              @change="matriculaStore.seleccionarFotoEstudiante"
              class="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <!-- Campos del estudiante -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre Completo del Estudiante</label
            >
            <input
              v-model="estudiante.nombres"
              type="text"
              placeholder="Ingrese el nombre completo"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grado a Matricular</label>
            <select
              v-model="gradoSelected"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar grado</option>
              <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                {{ grado.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad / Nivel</label>
            <input
              :value="especialidadSelected"
              type="text"
              disabled
              placeholder="Automático según el grado"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select
              v-model="turnoSelected"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar turno</option>
              <option v-for="turno in turnos" :key="turno.id" :value="turno.id">
                {{ turno.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >¿Repite el grado seleccionado?</label
            >
            <select
              v-model="repiteGrado"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar respuesta</option>
              <option value="Sí">Sí, repite grado</option>
              <option value="No">No, es nuevo en el grado</option>
            </select>
          </div>

          <!-- Checkbox de Validación y NIE -->
          <div class="md:col-span-2 mt-2 pt-4 border-t border-gray-100">
            <div class="flex items-center mb-4">
              <input
                id="provieneOtroCentro"
                type="checkbox"
                v-model="provieneOtroCentro"
                @change="manejarCambioCentro"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label
                for="provieneOtroCentro"
                class="ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                ¿El estudiante proviene de otro centro escolar?
              </label>
            </div>

            <div
              v-if="provieneOtroCentro"
              class="animate-fade-in grid grid-cols-1 gap-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  NIE del Estudiante
                </label>
                <input
                  v-model="estudiante.NIE"
                  type="text"
                  placeholder="Ingrese el NIE"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Certificado del último año aprobado
                </label>
                <p class="text-[11px] text-gray-500 mb-2">Formatos admitidos: PDF, JPG, PNG.</p>
                <div class="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf, image/jpeg, image/png"
                    @change="matriculaStore.seleccionarCertificado"
                    class="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer border border-gray-300 rounded-lg bg-white"
                  />
                  <span
                    v-if="certificadoEstudiante"
                    class="text-xs font-medium text-green-600 flex items-center shrink-0"
                  >
                    <i class="pi pi-check-circle mr-1"></i> Listo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BLOQUE 2: ANTIGUO INGRESO -->
    <div v-else-if="esAntiguoIngreso" class="animate-fade-in mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="flex flex-col items-center text-center space-y-4">
          <div
            class="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
          >
            <img v-if="fotoPreview" :src="fotoPreview" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <i class="pi pi-user text-5xl text-gray-300"></i>
            </div>
          </div>
          <p class="text-xs text-gray-400">Foto del estudiante (no editable)</p>
        </div>

        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre Completo del Estudiante</label
            >
            <input
              :value="estudianteSeleccionado?.nombres || ''"
              type="text"
              readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">NIE</label>
            <input
              :value="estudianteSeleccionado?.NIE || ''"
              type="text"
              readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grado a Matricular</label>
            <select
              v-model="gradoSelected"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar grado</option>
              <option v-for="grado in grados" :key="grado.id" :value="grado.id">
                {{ grado.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidad / Nivel</label>
            <input
              :value="especialidadSelected"
              type="text"
              disabled
              placeholder="Automático según el grado"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select
              v-model="turnoSelected"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar turno</option>
              <option v-for="turno in turnos" :key="turno.id" :value="turno.id">
                {{ turno.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >¿Repite el grado seleccionado?</label
            >
            <select
              v-model="repiteGrado"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccionar respuesta</option>
              <option value="Sí">Sí, repite grado</option>
              <option value="No">No, es nuevo en el grado</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- BLOQUE UNIFICADO DE SALUD -->
    <div
      v-if="esNuevoIngreso || esAntiguoIngreso"
      class="border-t border-gray-200 pt-6 animate-fade-in"
    >
      <h3 class="text-sm font-semibold text-gray-700 mb-4">Información de Salud</h3>
      <p class="text-xs text-gray-500 mb-4">
        Si el estudiante no posee ninguna, deje las opciones en blanco.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- ENFERMEDAD PRINCIPAL (Combo box simple) -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enfermedad Principal</label>
          <select
            v-model="enfermedadPrincipal"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="">Ninguna / Seleccione...</option>
            <option
              v-for="enf in enfermedades.filter((e) => e.nombre !== 'Ninguna')"
              :key="enf.id"
              :value="enf.id"
            >
              {{ enf.nombre }}
            </option>
          </select>
        </div>

        <!-- DISCAPACIDADES (Múltiples) -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">Discapacidades</label>
          <div class="flex gap-2 mb-3">
            <select
              v-model="tempDiscapacidad"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="" disabled>Seleccione...</option>
              <option
                v-for="disc in discapacidades.filter(
                  (d) => d.nombre !== 'Ninguna' && !salud.discapacidades.includes(d.id),
                )"
                :key="disc.id"
                :value="disc.id"
              >
                {{ disc.nombre }}
              </option>
            </select>
            <button
              @click="agregarSalud('discapacidad')"
              type="button"
              class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition duration-150 ease-in-out"
            >
              Agregar
            </button>
          </div>
          <div class="flex flex-wrap gap-2 min-h-[32px]">
            <span
              v-for="idDisc in salud.discapacidades"
              :key="idDisc"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {{ discapacidades.find((d) => d.id === idDisc)?.nombre }}
              <button
                @click="eliminarSalud('discapacidad', idDisc)"
                type="button"
                class="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </span>
          </div>
        </div>

        <!-- MEDICAMENTOS (Múltiples) -->
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Medicamentos Frecuentes</label
          >
          <div class="flex gap-2 mb-3">
            <select
              v-model="tempMedicamento"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="" disabled>Seleccione...</option>
              <option
                v-for="med in medicamentos.filter(
                  (m) => m.nombre !== 'Ninguno' && !salud.medicamentos.includes(m.id),
                )"
                :key="med.id"
                :value="med.id"
              >
                {{ med.nombre }}
              </option>
            </select>
            <button
              @click="agregarSalud('medicamento')"
              type="button"
              class="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition duration-150 ease-in-out"
            >
              Agregar
            </button>
          </div>
          <div class="flex flex-wrap gap-2 min-h-[32px]">
            <span
              v-for="idMed in salud.medicamentos"
              :key="idMed"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {{ medicamentos.find((m) => m.id === idMed)?.nombre }}
              <button
                @click="eliminarSalud('medicamento', idMed)"
                type="button"
                class="ml-2 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                <i class="pi pi-times text-[10px]"></i>
              </button>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>