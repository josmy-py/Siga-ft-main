<script setup>
// M2.5: el formulario registra o edita (solo DIRECTOR) y la tabla lista desde la API
import { nextTick, ref } from 'vue'
import FormDiscapacidad from '@/modules/Admin/Forms/Discapacidades.vue'
import TableDiscapacidad from '@/modules/Admin/Tables/TablaDiscapacidad.vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const editada = ref(null)

const editar = async (discapacidad) => {
  editada.value = discapacidad
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
        <FormDiscapacidad
            v-if="auth.esDirector"
            ref="formulario"
            :discapacidad="editada"
            @guardado="alGuardar"
            @cancelar="editada = null"
        />
        <TableDiscapacidad ref="tabla" @editar="editar"/>
    </div>
    </template>
