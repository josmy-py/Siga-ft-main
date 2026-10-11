<script setup>
import { onMounted, ref, watch } from "vue";
import Swal from "sweetalert2";
import FormUser from "../Forms/Usuarios.vue";
import { usuarioService } from "@/services/usuarioService";
import { mensajeError } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { ESTADO_ETIQUETAS, ROL_OPCIONES, etiquetaRol } from "@/constants/roles";

const authStore = useAuthStore();

const activeSection = ref("Usuarios");
const search = ref("");
const filtroRol = ref("");
const filtroEstado = ref("");
const verForm = ref(false);
const usuarioEditado = ref(null);

const usuarios = ref([]);
const cargando = ref(false);
const errorCarga = ref(null);

const cargarUsuarios = async () => {
  cargando.value = true;
  errorCarga.value = null;
  try {
    usuarios.value = await usuarioService.listar({
      buscar: search.value.trim(),
      rol: filtroRol.value,
      estado: filtroEstado.value,
    });
  } catch (error) {
    errorCarga.value = mensajeError(error, "No se pudieron cargar los usuarios");
  } finally {
    cargando.value = false;
  }
};

// Búsqueda por nombre, correo o DUI en el backend
let temporizador = null;
watch(search, () => {
  clearTimeout(temporizador);
  temporizador = setTimeout(cargarUsuarios, 350);
});
watch([filtroRol, filtroEstado], cargarUsuarios);

onMounted(cargarUsuarios);

const abrirCrear = () => {
  usuarioEditado.value = null;
  verForm.value = true;
};

const abrirEditar = (usuario) => {
  usuarioEditado.value = usuario;
  verForm.value = true;
};

const cerrarModal = () => {
  verForm.value = false;
  usuarioEditado.value = null;
};

const alGuardar = async (mensaje) => {
  cerrarModal();
  await cargarUsuarios();
  Swal.fire({ icon: "success", title: mensaje, timer: 2500, showConfirmButton: false });
};

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

const ejecutar = async (accion, porDefecto) => {
  try {
    const { message } = await accion();
    await cargarUsuarios();
    Swal.fire({ icon: "success", title: message, timer: 2500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: "error", title: mensajeError(error, porDefecto) });
  }
};

const alternarEstado = async (usuario) => {
  const nuevo = usuario.estado === "activo" ? "inactivo" : "activo";
  const verbo = nuevo === "activo" ? "activar" : "desactivar";
  if (!(await confirmar(`¿Desea ${verbo} la cuenta?`, usuario.email))) return;
  await ejecutar(() => usuarioService.cambiarEstado(usuario.id, nuevo), "No se pudo cambiar el estado");
};

const reenviarEnlace = async (usuario) => {
  await ejecutar(() => usuarioService.reenviarEnlace(usuario.id), "No se pudo reenviar el enlace");
};

const eliminar = async (usuario) => {
  if (!(await confirmar("¿Eliminar la cuenta?", "Solo se eliminan cuentas sin información asociada; en otro caso, desactívela."))) return;
  await ejecutar(() => usuarioService.eliminar(usuario.id), "No se pudo eliminar el usuario");
};

const esPropia = (usuario) => usuario.id === authStore.user?.id;

const tabClass = (name) => [
  "px-8 py-3 rounded-t-[24px] border border-transparent font-semibold text-lg transition-all duration-200",
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
          <h1 class="text-4xl font-bold text-slate-900">Usuarios</h1>

          <p class="text-slate-500 mt-2">Gestión de usuarios y roles.</p>
        </div>
      </header>

      <nav class="flex gap-4 mb-0">
        <button :class="tabClass('Usuarios')" @click="activeSection = 'Usuarios'">
          Todos los usuarios
        </button>
      </nav>

      <div class="bg-white rounded-b-3xl rounded-r-3xl shadow-xl p-6 overflow-hidden">
        <section v-if="activeSection === 'Usuarios'">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por nombre, correo o DUI..."
              class="w-full max-w-sm h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />

            <select v-model="filtroRol" class="h-11 px-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500">
              <option value="">Todos los roles</option>
              <option v-for="opcion in ROL_OPCIONES" :key="opcion.valor" :value="opcion.valor">{{ opcion.etiqueta }}</option>
            </select>

            <select v-model="filtroEstado" class="h-11 px-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500">
              <option value="">Todos los estados</option>
              <option v-for="(etiqueta, valor) in ESTADO_ETIQUETAS" :key="valor" :value="valor">{{ etiqueta }}</option>
            </select>

            <button
              @click="abrirCrear"
              class="ml-auto h-11 px-5 rounded-lg bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition"
            >
              + Crear Usuario
            </button>
          </div>

          <div v-if="errorCarga" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorCarga }}
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr>
                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Nombre
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Correo
                  </th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">DUI</th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Rol</th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">Estado</th>

                  <th class="text-left bg-slate-100 px-4 py-3 text-slate-600 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="cargando && !usuarios.length">
                  <td colspan="6" class="px-4 py-6 text-center text-slate-500">Cargando usuarios...</td>
                </tr>

                <tr v-else-if="!usuarios.length">
                  <td colspan="6" class="px-4 py-6 text-center text-slate-500">No hay usuarios que coincidan.</td>
                </tr>

                <tr v-for="usuario in usuarios" :key="usuario.id">
                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.nombre || "(sin nombre)" }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.email }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    {{ usuario.dui || "(sin DUI)" }}
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="{
                        'bg-red-100 text-red-700': usuario.rol === 'DIRECTOR',
                        'bg-blue-100 text-blue-700': usuario.rol === 'DOCENTE',
                        'bg-green-100 text-green-700': usuario.rol === 'ENCARGADO',
                      }"
                    >
                      {{ etiquetaRol(usuario.rol) }}
                    </span>
                  </td>

                  <td class="px-4 py-4 border-b border-slate-200">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="{
                        'bg-green-100 text-green-700': usuario.estado === 'activo',
                        'bg-amber-100 text-amber-700': usuario.estado === 'pendiente',
                        'bg-slate-200 text-slate-600': usuario.estado === 'inactivo',
                      }"
                    >
                      {{ ESTADO_ETIQUETAS[usuario.estado] ?? usuario.estado }}
                    </span>
                  </td>

                  <td class="px-6 py-4 border-b border-slate-200">
                    <div class="flex justify-center flex-wrap gap-2">
                      <button
                        @click="abrirEditar(usuario)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        <i class="pi pi-pencil"></i>
                        Editar
                      </button>

                      <button
                        v-if="usuario.estado === 'pendiente'"
                        @click="reenviarEnlace(usuario)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition"
                        title="Reenviar el enlace para definir la contraseña"
                      >
                        <i class="pi pi-envelope"></i>
                        Reenviar enlace
                      </button>

                      <button
                        v-else-if="!esPropia(usuario)"
                        @click="alternarEstado(usuario)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-500 text-slate-600 hover:bg-slate-500 hover:text-white transition"
                      >
                        <i :class="usuario.estado === 'activo' ? 'pi pi-lock' : 'pi pi-lock-open'"></i>
                        {{ usuario.estado === "activo" ? "Desactivar" : "Activar" }}
                      </button>

                      <button
                        v-if="!esPropia(usuario)"
                        @click="eliminar(usuario)"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                      >
                        <i class="pi pi-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <FormUser v-if="verForm" :usuario="usuarioEditado" @cerrar="cerrarModal" @guardado="alGuardar" />
        </section>
      </div>
    </main>
  </div>
</template>
