<template>
  <footer class="bg-surface-900 text-white mt-auto">
    <div class="w-full px-4 md:px-8 py-12">
      <!-- Single Row Layout -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <!-- Logo and Description -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex items-center justify-center">
              <i class="pi pi-graduation-cap text-black text-2xl"></i>
            </div>
            <span class="text-black text-xl font-bold">Complejo Educativo Hacienda Colima</span>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col items-center text-center">
          <h4 class="text-black font-semibold mb-4">Enlaces Rápidos</h4>
          <ul class="space-y-2 text-sm text-black">
            <li><a href="#" class="text-primary transition-colors">Inicio</a></li>
            <li><a href="#" class="text-primary transition-colors">Institución</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="flex flex-col items-center text-center">
          <h4 class="text-black font-semibold mb-4">Contacto</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li class="flex items-center gap-2">
              <i class="pi pi-envelope text-primary"></i>
              <span>complejoeducativo@email.com</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-phone text-primary"></i>
              <span>+503 1234 5678</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-map-marker text-primary"></i>
              <span>San Salvador, El Salvador</span>
            </li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="flex flex-col items-center text-center">
          <h4 class="font-semibold mb-4">Síguenos</h4>
          <div class="flex gap-4">
            <a
              href="#"
              class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <i class="pi pi-facebook"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <i class="pi pi-instagram "></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <i class="pi pi-twitter"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <i class="pi pi-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 mt-10 pt-6 text-center">
        <p class="text-gray-500 text-sm">
          © 2026 Complejo Educativo Hacienda Colima. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>
