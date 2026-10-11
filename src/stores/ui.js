import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore(
  "ui",
  () => {
    const sidebarOpen = ref(true);

    const setSidebarOpen = (value) => {
      sidebarOpen.value = value;
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    return { sidebarOpen, setSidebarOpen, toggleSidebar };
  },
  {
    persist: true,
  },
);
