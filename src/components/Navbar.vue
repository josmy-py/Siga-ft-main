<script setup>
import { ref } from "vue";

// Estado para abrir/cerrar menú móvil
const isOpen = ref(false);
</script>

<template>
  <!-- Navbar -->
  <nav class="bg-white text-gray-800 shadow-md fixed w-full z-50 top-0 left-0">
    <div class="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center h-20">

      <!-- Logo & Título -->
      <router-link
        to="/"
        class="text-lg sm:text-xl text-gray-900 font-bold tracking-wide flex items-center gap-3 shrink-0"
      >
        <img
          src="https://static.vecteezy.com/system/resources/previews/003/224/489/original/education-logo-design-illustration-vector.jpg"
          alt="logo"
          class="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />

        <span class="leading-tight text-sm sm:text-base max-w-[180px] sm:max-w-none">
          Complejo Educativo<br class="sm:hidden" /> Hacienda Colima
        </span>
      </router-link>
<!-- Desktop Menu -->
      <div class="hidden md:flex gap-6 lg:gap-8 items-center font-medium">

        <!-- Inicio -->
        <router-link
          to="/"
          class="text-gray-700 hover:text-blue-600 font-semibold transition focus:outline-none py-2 border-b-2 border-transparent hover:border-blue-600"
        >
          Inicio
        </router-link>

        <div class="relative group inline-block">
          <button
            class="text-gray-700 hover:text-blue-600 font-semibold transition flex items-center gap-1 focus:outline-none py-2 border-b-2 border-transparent hover:border-blue-600 cursor-pointer"
          >
            Institución
            <i class="pi pi-chevron-down text-xs mt-0.5"></i>
          </button>

          <div
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Historia
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Reglamento
            </a>
          </div>
        </div>

        <div class="relative group inline-block">
          <button
            class="text-gray-700 hover:text-blue-600 font-semibold transition flex items-center gap-1 focus:outline-none py-2 border-b-2 border-transparent hover:border-blue-600 cursor-pointer"
          >
            Contacto
            <i class="pi pi-chevron-down text-xs mt-0.5"></i>
          </button>

          <div
            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Ubicación
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Correo
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Teléfonos
            </a>
          </div>
        </div>
      </div>

      <!-- Desktop Action Buttons (Ocultos en móvil con hidden md:flex) -->
      <div class="hidden md:flex items-center gap-3">
        <router-link
          to="/register"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2"
        >
          <i class="pi pi-user-plus"></i>
          Pre-matrícula
        </router-link>

        <router-link
          to="/login"
          class="border border-blue-600 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition flex items-center gap-2"
        >
          <i class="pi pi-sign-in"></i>
          Iniciar Sesión
        </router-link>
      </div>

      <!-- Mobile Hamburger Button (SOLO VISIBLE EN MÓVIL: md:hidden) -->
      <button
        @click="isOpen = !isOpen"
        class="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none p-2"
        aria-label="Toggle Menu"
      >
        <i :class="isOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-2xl"></i>
      </button>

    </div>

    <!-- Mobile Dropdown Menu -->
    <transition name="slide">
      <div
        v-if="isOpen"
        class="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-5 shadow-2xl absolute w-full left-0"
      >
        <!-- Inicio -->
        <router-link
          to="/"
          @click="isOpen = false"
          class="block text-gray-800 font-semibold hover:text-blue-600 transition"
        >
          Inicio
        </router-link>

        <!-- Seccion Institución -->
        <div class="space-y-2">
          <p class="text-blue-500 font-semibold text-xs uppercase tracking-wider">
            Institución
          </p>
          <a
            href="#"
            class="block text-gray-600 hover:text-blue-600 transition pl-4 text-sm"
          >
            Historia
          </a>
          <a
            href="#"
            class="block text-gray-600 hover:text-blue-600 transition pl-4 text-sm"
          >
            Reglamento
          </a>
        </div>

        <!-- Seccion Contacto -->
        <div class="space-y-2">
          <p class="text-blue-500 font-semibold text-xs uppercase tracking-wider">
            Contacto
          </p>
          <a
            href="#"
            class="block text-gray-600 hover:text-blue-600 transition pl-4 text-sm"
          >
            Ubicación
          </a>
          <a
            href="#"
            class="block text-gray-600 hover:text-blue-600 transition pl-4 text-sm"
          >
            Correo
          </a>
          <a
            href="#"
            class="block text-gray-600 hover:text-blue-600 transition pl-4 text-sm"
          >
            Teléfonos
          </a>
        </div>

        <!-- Botones Mobile -->
        <div class="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <router-link
            to="/register"
            @click="isOpen = false"
            class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <i class="pi pi-user-plus"></i>
            Pre-matrícula
          </router-link>

          <router-link
            to="/login"
            @click="isOpen = false"
            class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <i class="pi pi-sign-in"></i>
            Iniciar Sesión
          </router-link>
        </div>
      </div>
    </transition>
  </nav>

  <div class="h-20"></div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>