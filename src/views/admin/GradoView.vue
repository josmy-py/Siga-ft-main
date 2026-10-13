<script setup>
// M2.5: el formulario registra o edita desde el catálogo oficial (solo DIRECTOR)
// y la tabla lista los grados registrados en orden académico
import { nextTick, ref } from 'vue'
import FormGrado from '@/modules/Admin/Forms/Grados.vue'
import TableGrado from '@/modules/Admin/Tables/TablaGrado.vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const editado = ref(null)

const editar = async (grado) => {
  editado.value = grado
  await nextTick()
  formulario.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}

const alGuardar = () => {
  editado.value = null
  tabla.value?.cargar()
}

// El grado eliminado vuelve a quedar disponible en el catálogo oficial
const alEliminar = () => {
  editado.value = null
  formulario.value?.cargarCatalogo()
}
</script>

<template>
    <div class="p-6">
        <FormGrado
            v-if="auth.esDirector"
            ref="formulario"
            :grado="editado"
            @guardado="alGuardar"
            @cancelar="editado = null"
        />
        <TableGrado ref="tabla" @editar="editar" @eliminado="alEliminar"/>
    </div>
    </template>
