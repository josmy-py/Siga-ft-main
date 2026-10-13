<script setup>
// M2.5: el formulario registra o edita (solo DIRECTOR) y la tabla lista desde la API
import { nextTick, ref } from 'vue'
import FormEspecialidad from '@/modules/Admin/Forms/Especialiades.vue'
import TableEspecialidad from '@/modules/Admin/Tables/TablaEspecialidad.vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const editada = ref(null)

const editar = async (especialidad) => {
  editada.value = especialidad
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
        <FormEspecialidad
            v-if="auth.esDirector"
            ref="formulario"
            :especialidad="editada"
            @guardado="alGuardar"
            @cancelar="editada = null"
        />
        <TableEspecialidad ref="tabla" @editar="editar"/>
    </div>
    </template>
