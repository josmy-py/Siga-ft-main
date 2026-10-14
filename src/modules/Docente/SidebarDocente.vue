<script setup>
import { useAuthStore } from "@/stores/authStore";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const authStore = useAuthStore();

const cerrarSesion = () => {
  handleNavClick();
  authStore.logout();
};

const isMobile = () => window.innerWidth < 768;

const handleMenuClick = () => {
  if (!props.open) return;

  if (isMobile()) {
    emit("close");
  }
};

const handleNavClick = () => {
  if (!props.open) return;

  if (isMobile()) {
    emit("close");
  }
};
</script>

<template>
  <div>
    <div
      v-if="open"
      @click="handleMenuClick"
      class="fixed inset-0 bg-black/40 z-30 md:hidden"
    ></div>

    <aside
      :class="[
        'bg-white text-black h-screen transition-all duration-300 fixed inset-y-0 left-0 z-40',
        open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden',
      ]"
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="bg-blue-500 flex items-center gap-2 drop-shadow p-2 rounded">
          <i class="pi pi-graduation-cap text-white"></i>

          <h3 class="text-xs text-white">Complejo Educativo Hacienda Colima</h3>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="mt-4 flex flex-col text-sm pb-24">

        <router-link to="/docente/perfil" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-user text-blue-500"></i>
          </div>
          Mi Perfil
        </router-link>

        <router-link to="/docente/asignaturas" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-check-circle text-blue-500"></i>
          </div>
          Mis Asignaturas
        </router-link>

        <router-link to="/docente/notas" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-file-edit text-blue-500"></i>
          </div>
          Registro de Notas
        </router-link>

        <router-link to="/docente/estudiantes" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-users text-blue-500"></i>
          </div>
          Mis Estudiantes
        </router-link>

        <router-link to="/docente/conducta" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-star text-blue-500"></i>
          </div>
          Conducta
        </router-link>

        <router-link to="/docente/reportes" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-chart-bar text-blue-500"></i>
          </div>
          Libreta
        </router-link>

        <router-link to="/docente/grados-secciones" class="menu-item" @click="handleNavClick">
          <div class="bg-white drop-shadow p-2 rounded-full">
            <i class="pi pi-book text-blue-500"></i>
          </div>
          Grados y Secciones
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <button type="button" class="menu-item w-full border-0 bg-transparent cursor-pointer text-red-400 hover:bg-red-50" @click="cerrarSesion">
          <i class="pi pi-sign-out"></i>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  transition: all 0.2s;
  text-decoration: none;
  color: #2563eb;
}

.menu-item:hover {
  border-radius: 999px;
  background: white;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.router-link-active {
  border-radius: 999px;
  background: white;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
</style>
