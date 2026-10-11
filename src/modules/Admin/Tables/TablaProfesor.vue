<script setup>
import { computed, ref } from "vue";
import FormProfesores from "../Forms/Profesores.vue";

const activeSection = ref("Profesores");
const search = ref("");

const mostrarModal = ref(false);

const cerrarModal = () => {
  mostrarModal.value = false;
};

const profesor = ref([
  {
    usuario: "Luis Miguel",
    codigo: "PROF-001",
    fecha_nacimiento: "1990-05-12",
    telefono: "7777-1111",
    direccion: "San Salvador",
  },
  {
    usuario: "Marta Franco ",
    codigo: "PROF-002",
    fecha_nacimiento: "1988-08-20",
    telefono: "7777-2222",
    direccion: "Santa Tecla",
  },
  {
    usuario: "Anguel Francisco",
    codigo: "PROF-003",
    fecha_nacimiento: "1992-11-30",
    telefono: "7777-3333",
    direccion: "Soyapango",
  },
]);

const filteredProfesores = computed(() =>
  profesor.value.filter((p) => p.codigo.toLowerCase().includes(search.value.toLowerCase())),
);

const tabClass = (name) => [
  "px-8 py-2 rounded-t-[24px] border border-transparent font-semibold text-lg transition-all duration-200",
  activeSection.value === name
    ? "bg-white text-slate-900 relative z-20 -mb-[2px]"
    : "bg-slate-200 text-slate-600 hover:bg-slate-300",
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
    <main class="transition-all duration-300 p-6">
      <header class="mb-6">
        <div>
          <h1 class="text-4xl font-bold text-slate-900">Profesores</h1>

          <p class="text-slate-500 mt-2">Gestión de profesores y asignaciones.</p>
        </div>
      </header>

      <nav class="flex gap-4 mb-0">
        <button :class="tabClass('Profesores')" @click="activeSection = 'Profesores'">
          Profesores
        </button>
      </nav>

      <div class="bg-white rounded-b-3xl rounded-r-3xl shadow-xl p-6 overflow-hidden">
        <section v-if="activeSection === 'Profesores'">
          <div class="flex items-center gap-4 mb-6">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar profesor..."
              class="w-full max-w-sm h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />

            <button
              @click="mostrarModal = true"
              class="ml-auto h-11 px-5 rounded-lg bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition"
            >
              + Agregar
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Usuario
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Código
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Fecha de Nacimiento
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Teléfono
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Dirección
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="profesor in filteredProfesores"
                  :key="profesor.id_usuario"
                  class="hover:bg-slate-50"
                >
                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">
                    {{ profesor.usuario }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700 font-medium">
                    {{ profesor.codigo }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">
                    {{ profesor.fecha_nacimiento }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">
                    {{ profesor.telefono }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200 text-slate-700">
                    {{ profesor.direccion }}
                  </td>

                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-3">
                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                      <button
                        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                      >
                        <i class="pi pi-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="filteredProfesores.length === 0">
                  <td colspan="6" class="text-center py-6 text-slate-500">
                    No se encontraron profesores.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <FormProfesores v-if="mostrarModal" @cerrar="cerrarModal" />
        </section>
      </div>
    </main>
  </div>
</template>
