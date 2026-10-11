<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

import Navbar from "./Navbar.vue";
import SidebarCliente from "../modules/Cliente/SidebarCliente.vue";

const sidebarOpen = ref(false);
const route = useRoute();

const isDesktop = () => window.innerWidth >= 768;

const initializeSidebar = () => {
  sidebarOpen.value = isDesktop();
};

const handleResize = () => {
  sidebarOpen.value = isDesktop();
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

onMounted(() => {
  initializeSidebar();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

watch(
  () => route.fullPath,
  () => {
    if (window.innerWidth < 768) {
      sidebarOpen.value = false;
    }
  },
);
</script>

<template>
  <div class="h-screen flex flex-row bg-slate-50 overflow-hidden font-sans text-slate-900 relative">
    <SidebarCliente :open="sidebarOpen" @close="closeSidebar" />

    <div
      :class="[
        'flex-1 flex flex-col min-w-0 overflow-hidden h-full transition-all duration-300',
        sidebarOpen ? 'md:ml-64' : 'ml-0',
      ]"
    >
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main
        class="flex-1 p-4 md:p-6 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
      >
        <RouterView />
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden transition-all"
      @click="closeSidebar"
    ></div>
  </div>
</template>
