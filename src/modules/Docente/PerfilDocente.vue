<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div class="text-center">
        <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-user text-2xl text-white"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">{{ user.nombre }}</h2>
        <p class="text-gray-500 mt-1">{{ user.email }}</p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <i class="pi pi-id-card text-blue-500 w-5 h-5"></i>
          <div>
            <p class="text-sm font-medium text-gray-600">ID de Usuario</p>
            <p class="text-gray-800">{{ user.id }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <i class="pi pi-envelope text-blue-500 w-5 h-5"></i>
          <div>
            <p class="text-sm font-medium text-gray-600">Correo Electrónico</p>
            <p class="text-gray-800">{{ user.email }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <i class="pi pi-user-plus text-blue-500 w-5 h-5"></i>
          <div>
            <p class="text-sm font-medium text-gray-600">Rol</p>
            <p class="text-gray-800 capitalize">{{ user.rol }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <i class="pi pi-briefcase text-blue-500 w-5 h-5"></i>
          <div>
            <p class="text-sm font-medium text-gray-600">Especialidad</p>
            <p class="text-gray-800">{{ user.especialidad }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <i class="pi pi-calendar text-blue-500 w-5 h-5"></i>
          <div>
            <p class="text-sm font-medium text-gray-600">Fecha de Registro</p>
            <p class="text-gray-800">{{ user.createdAt }}</p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <button
          @click="logout"
          class="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <i class="pi pi-sign-out mr-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// La ruta está protegida por el guard (rol DOCENTE): aquí siempre hay sesión
const authStore = useAuthStore()

const user = computed(() => ({
  ...authStore.user,
  rol: authStore.etiquetaRol,
  createdAt: authStore.user?.created_at ? new Date(authStore.user.created_at).toLocaleDateString('es-SV') : '',
}))

const logout = () => authStore.logout()
</script>