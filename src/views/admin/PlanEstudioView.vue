<script setup>
// M2.5: planes de estudio por grado y especialidad, con sus materias (D-C1).
// Todos los usuarios con sesión consultan; solo el DIRECTOR modifica (D-C3)
import { nextTick, onMounted, ref } from 'vue'
import FormPlanEstudio from '@/modules/Admin/Forms/PlanEstudio.vue'
import TablePlanEstudio from '@/modules/Admin/Tables/TablaPlanEstudio.vue'
import MateriasView from '@/views/admin/MateriaView.vue'
import { gradoService, especialidadService, planEstudioService } from '@/services/catalogoService'
import { mensajeError } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const formulario = ref(null)
const tabla = ref(null)
const panelMaterias = ref(null)

const grados = ref([])
const especialidades = ref([])
const errorCatalogos = ref(null)
const editado = ref(null)
const planAbierto = ref(null)

onMounted(async () => {
    try {
        const [respuestaGrados, respuestaEspecialidades] = await Promise.all([
            gradoService.getAll(),
            especialidadService.getAll(),
        ])
        grados.value = respuestaGrados.grados
        especialidades.value = [...respuestaEspecialidades.especialidades].sort((a, b) => a.nombre.localeCompare(b.nombre))
    } catch (error) {
        errorCatalogos.value = mensajeError(error, 'No se pudieron cargar los grados y especialidades')
    }
})

const editar = async (plan) => {
    editado.value = plan
    await nextTick()
    formulario.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}

const abrirMaterias = async (plan) => {
    planAbierto.value = plan
    await nextTick()
    panelMaterias.value?.scrollIntoView({ behavior: 'smooth' })
}

// Recarga la tabla y mantiene el plan abierto con sus datos nuevos (conteo, nombre)
const recargar = async () => {
    await tabla.value?.cargar()
    if (planAbierto.value) {
        try {
            const { plan } = await planEstudioService.getById(planAbierto.value.id)
            planAbierto.value = plan
        } catch {
            planAbierto.value = null
        }
    }
}

const alGuardar = () => {
    editado.value = null
    recargar()
}

const alEliminar = (plan) => {
    if (editado.value?.id === plan.id) editado.value = null
    if (planAbierto.value?.id === plan.id) planAbierto.value = null
}
</script>

<template>
    <div class="p-6">
        <div v-if="errorCatalogos" class="mx-4 md:mx-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorCatalogos }}
        </div>
        <FormPlanEstudio
            v-if="auth.esDirector"
            ref="formulario"
            :plan="editado"
            :grados="grados"
            :especialidades="especialidades"
            @guardado="alGuardar"
            @cancelar="editado = null"
        />
        <TablePlanEstudio
            ref="tabla"
            :grados="grados"
            :plan-seleccionado-id="planAbierto?.id ?? null"
            @editar="editar"
            @materias="abrirMaterias"
            @eliminado="alEliminar"
        />
        <div ref="panelMaterias">
            <MateriasView
                v-if="planAbierto"
                :plan="planAbierto"
                @cambio="tabla?.cargar()"
                @cerrar="planAbierto = null"
            />
        </div>
    </div>
    </template>
