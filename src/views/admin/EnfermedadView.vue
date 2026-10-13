<script setup>
// M2.5: el formulario registra o edita (solo DIRECTOR) y la tabla lista desde la API
import { nextTick, ref } from 'vue'
import FormEnfermedad from '@/modules/Admin/Forms/Enfermedades.vue'
import TableEnfermedad from '@/modules/Admin/Tables/TablaEnfermedad.vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const editada = ref(null)

const editar = async (enfermedad) => {
  editada.value = enfermedad
  await nextTick()
  formulario.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}

const alGuardar = () => {
  editada.value = null
  tabla.value?.cargar()
}
</script>

<template>
    <div class="p-6">
        <FormEnfermedad
            v-if="auth.esDirector"
            ref="formulario"
            :enfermedad="editada"
            @guardado="alGuardar"
            @cancelar="editada = null"
        />
        <TableEnfermedad ref="tabla" @editar="editar"/>
    </div>
    </template>
