<script setup>
// M2.5: el formulario registra o edita (solo DIRECTOR) y la tabla lista desde la API
import { nextTick, ref } from 'vue'
import FormEspecialidad from '@/modules/Admin/Forms/Especialiades.vue'
import TableEspecialidad from '@/modules/Admin/Tables/TablaEspecialidad.vue'
import { useAuthStore } from '@/stores/authStore'
import { useAnioActivo } from '@/composables/useAnioActivo'

const auth = useAuthStore()
// Con un año lectivo activo las especialidades solo se consultan
const { anioActivo } = useAnioActivo()
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
        <div v-if="auth.esDirector && anioActivo" class="mx-4 md:mx-6 mb-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            Hay un año lectivo activo ({{ anioActivo.anio }}): las especialidades no se pueden crear, modificar ni eliminar hasta que se cierre.
        </div>
        <FormEspecialidad
            v-else-if="auth.esDirector"
            ref="formulario"
            :especialidad="editada"
            @guardado="alGuardar"
            @cancelar="editada = null"
        />
        <TableEspecialidad ref="tabla" :bloqueado="!!anioActivo" @editar="editar"/>
    </div>
    </template>
