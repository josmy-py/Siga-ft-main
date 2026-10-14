<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-between">
    <div>
      <Navbar />

      <!-- Banner Principal / Hero -->
      <div class="container mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div class="bg-white rounded-3xl shadow-xl md:shadow-2xl overflow-hidden">
          <div class="flex flex-col-reverse md:flex-row">
            <!-- Content -->
            <div class="p-6 sm:p-8 md:w-1/2 flex flex-col justify-center">
              <h1 class="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 leading-tight">
                Bienvenido/@s
              </h1>

              <p class="text-gray-600 text-base sm:text-lg leading-relaxed">
                La educación es el arma más poderosa que puedes usar para cambiar el mundo.
              </p>

              <div>
                <button
                  class="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-md cursor-pointer"
                >
                  Conocer más..
                </button>
              </div>
            </div>

            <!-- Image -->
            <div class="md:w-1/2">
              <img
                src="https://bpic.588ku.com/back_pic/23/04/29/cec7a25ddadab201b8429c4e13a57f96.png"
                alt="banner"
                class="w-full h-56 sm:h-72 md:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Colored Grid Tiles -->
      <div class="container mx-auto px-4 sm:px-6 py-4">
        <ColoredGrid />
      </div>

      <!-- Overlapping Section (Misión, Visión, Comunidad) -->
      <div class="container mx-auto px-4 sm:px-6 pb-12">
        <OverlappingImage alt="Institución educativa">
          <template #image>
            <div class="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://i1-c.pinimg.com/736x/75/67/2c/75672cbf28a357f022bfb097b07feab0.jpg"
                alt="Campus educativo"
                class="w-full h-96 md:h-80 object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
          </template>

          <template #overlay>
            <!-- Corregido: flex-col en móvil, flex-row en escritorio -->
            <div class="flex flex-col md:flex-row gap-6 justify-center items-stretch px-4">
              <!-- Misión -->
              <div
                class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-full md:w-56 hover:bg-white/25 transition cursor-pointer"
              >
                <i class="pi pi-book text-4xl mb-3 text-blue-200"></i>
                <h3 class="font-bold text-lg mb-1 text-white">Misión</h3>
                <p class="text-sm text-white/80 leading-relaxed">
                  Formamos ciudadanos íntegros con valores y excelencia académica.
                </p>
              </div>

              <!-- Visión -->
              <div
                class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-full md:w-56 hover:bg-white/25 transition cursor-pointer md:mt-10"
              >
                <i class="pi pi-eye text-4xl mb-3 text-green-200"></i>
                <h3 class="font-bold text-lg mb-1 text-white">Visión</h3>
                <p class="text-sm text-white/80 leading-relaxed">
                  Ser referentes en educación de calidad e innovación pedagógica.
                </p>
              </div>

              <!-- Comunidad -->
              <div
                class="bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-xl text-white border border-white/20 w-full md:w-56 hover:bg-white/25 transition cursor-pointer md:mt-5"
              >
                <i class="pi pi-users text-4xl mb-3 text-yellow-200"></i>
                <h3 class="font-bold text-lg mb-1 text-white">Comunidad</h3>
                <p class="text-sm text-white/80 leading-relaxed">
                  Más de 500 estudiantes, docentes y familias unidos por el aprendizaje.
                </p>
              </div>
            </div>
          </template>
        </OverlappingImage>
      </div>
    </div>

    <!-- Footer siempre pegado al fondo -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import ColoredGrid from "@/components/ColoredGrid.vue";
import OverlappingImage from "@/components/OverlappingImage.vue";
</script>