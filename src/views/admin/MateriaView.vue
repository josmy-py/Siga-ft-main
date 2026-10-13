<script setup>
// M2.5 (D-C1): materias de un plan de estudios. Se abre desde Planes de estudio;
// agregar, renombrar y eliminar solo para DIRECTOR
import { nextTick, ref } from 'vue'
import FormMateria from '@/modules/Admin/Forms/Materias.vue'
import TableMateria from '@/modules/Admin/Tables/TablaMateria.vue'
import { useAuthStore } from '@/stores/authStore'

defineProps({
    plan: { type: Object, required: true },
})

const emit = defineEmits(['cambio', 'cerrar'])

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const editada = ref(null)

const editar = async (materia) => {
    editada.value = materia
    await nextTick()
    formulario.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}

const alGuardar = () => {
    editada.value = null
    tabla.value?.cargar()
    emit('cambio')
}
</script>

<template>
    <div class="p-6 border-t-4 border-emerald-500 bg-emerald-50/40 rounded-3xl">
        <div class="flex justify-end px-4 md:px-6">
            <button
                @click="emit('cerrar')"
                class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
                <i class="pi pi-times"></i>
                Cerrar materias
            </button>
        </div>
        <FormMateria
            v-if="auth.esDirector"
            ref="formulario"
            :plan="plan"
            :materia="editada"
            @guardado="alGuardar"
            @cancelar="editada = null"
        />
        <TableMateria ref="tabla" :plan="plan" @editar="editar" @cambio="emit('cambio')"/>
    </div>
    </template>
