import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { matriculaService } from "@/services/matriculaService";

export const useMatriculaStore = defineStore("matricula", () => {
  // --- ESTADOS DE CONTROL Y NAVEGACIÓN ---
  const cargando = ref(false);
  const erroresValidacion = ref(null);
  const estadoMatricula = ref("pendiente");
  const pestañaActiva = ref("dato");

  const tipoMatricula = ref("");
  const pasoAntiguo = ref("busqueda");
  const pasoNuevo = ref("busqueda");

  const estudianteSeleccionado = ref(null);

  // --- ESTADOS DE ESTUDIANTE ---
  const estudiante = ref({
    nombres: "",
    NIE: "",
  });
  const fotoEstudiante = ref(null);
  const fotoPreview = ref("");
  const certificadoEstudiante = ref(null);

  // --- ESTADOS DE ENCARGADO ---
  const encargado = ref({
    nombres: "",
    dui: "",
    telefono: "",
    parentescoId: "",
  });
  const encargadoSeleccionado = ref(null);
  const encargadoManual = ref(false);
  const encargadoConfirmado = ref(false);

  // --- ESTADOS DE SALUD ---
  const salud = ref({
    enfermedades: [],
    discapacidades: [],
    medicamentos: [],
  });

  // --- ESTADOS ACADÉMICOS ---
  const gradoSelected = ref("");
  const turnoSelected = ref("");
  const repiteGrado = ref("");

  // --- CATÁLOGOS ---
  const parentescos = ref([]);
  const grados = ref([]);
  const turnos = ref([]);
  const enfermedades = ref([]);
  const discapacidades = ref([]);
  const medicamentos = ref([]);
  const estudiantesBuscados = ref([]);

  // --- COMPUTADOS ---
  const esNuevoIngreso = computed(() => tipoMatricula.value === "nuevo");
  const esAntiguoIngreso = computed(() => tipoMatricula.value === "antiguo");

  const encargadosDisponibles = computed(() => {
    if (!estudianteSeleccionado.value) return [];
    const lista = [];
    if (estudianteSeleccionado.value.padre) {
      lista.push({ ...estudianteSeleccionado.value.padre, rol: "Padre" });
    }
    if (estudianteSeleccionado.value.madre) {
      lista.push({ ...estudianteSeleccionado.value.madre, rol: "Madre" });
    }
    return lista;
  });

  const especialidadSelected = computed(() => {
    const gradoEncontrado = grados.value.find((g) => g.id === gradoSelected.value);
    if (!gradoEncontrado) return "";
    return gradoEncontrado.especialidad || gradoEncontrado.nivel || "";
  });

  const labelTipoMatricula = computed(() =>
    tipoMatricula.value === "antiguo" ? "Antiguo Ingreso" : "Nuevo Ingreso"
  );

  // --- PETICIONES MEDIANTE EL SERVICIO ---

  // 1. Cargar catálogos desde el Servicio
  const cargarCatalogos = async () => {
    try {
      cargando.value = true;
      const response = await matriculaService.obtenerCatalogos();

      grados.value = response.data.grados;
      turnos.value = response.data.turnos;
      parentescos.value = response.data.parentescos;
    } catch (error) {
      console.error("Error al obtener catálogos iniciales:", error);
    } finally {
      cargando.value = false;
    }
  };

  // 2. Buscar estudiante antiguo por NIE o Nombre
  const buscarEstudiante = async (termino) => {
    try {
      cargando.value = true;
      const { data } = await matriculaService.buscarEstudiante(termino);
      estudiantesBuscados.value = data;
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
    } finally {
      cargando.value = false;
    }
  };

  // 3. Procesar y enviar todo el formulario de matrícula
  const enviarMatriculaBackend = async () => {
    cargando.value = true;
    erroresValidacion.value = null;

    try {
      const formData = new FormData();

      // Datos de control
      formData.append("tipo_matricula", tipoMatricula.value);
      formData.append("grado_id", gradoSelected.value);
      formData.append("turno_id", turnoSelected.value);
      formData.append("repite_grado", repiteGrado.value);

      // Datos de estudiante
      formData.append("estudiante_nombres", estudiante.value.nombres);
      formData.append("estudiante_nie", estudiante.value.NIE);
      
      if (estudianteSeleccionado.value) {
        formData.append("estudiante_id", estudianteSeleccionado.value.id);
      }

      // Archivos adjuntos
      if (fotoEstudiante.value) {
        formData.append("foto", fotoEstudiante.value);
      }
      if (certificadoEstudiante.value) {
        formData.append("certificado", certificadoEstudiante.value);
      }

      // Datos de encargado
      const datosEncargado = obtenerDatosEncargadoEnvio();
      formData.append("encargado_nuevo", datosEncargado.esNuevo);
      if (datosEncargado.esNuevo) {
        formData.append("encargado_nombres", datosEncargado.datos.nombres);
        formData.append("encargado_dui", datosEncargado.datos.dui);
        formData.append("encargado_telefono", datosEncargado.datos.telefono);
        formData.append("encargado_parentesco_id", datosEncargado.datos.parentescoId);
      } else {
        formData.append("encargado_id", datosEncargado.id);
      }

      // Arrays de salud
      formData.append("enfermedades", JSON.stringify(salud.value.enfermedades));
      formData.append("discapacidades", JSON.stringify(salud.value.discapacidades));
      formData.append("medicamentos", JSON.stringify(salud.value.medicamentos));

      // Envío a través del servicio
      const response = await matriculaService.enviarMatricula(formData);

      console.log("Matrícula guardada exitosamente:", response.data);
      return { exito: true, data: response.data };

    } catch (error) {
      if (error.response && error.response.status === 422) {
        erroresValidacion.value = error.response.data.errors;
      } else {
        console.error("Error al procesar la matrícula:", error);
      }
      return { exito: false, error };
    } finally {
      cargando.value = false;
    }
  };

  // --- ACCIONES LOCALES DE INTERFAZ ---
  const seleccionarTipoMatricula = (tipo) => {
    tipoMatricula.value = tipo;
    pestañaActiva.value = "dato";
    pasoAntiguo.value = "busqueda";
    pasoNuevo.value = "busqueda";
    if (tipo === "nuevo") {
      estudiante.value = { nombres: "", NIE: "" };
      fotoPreview.value = "";
      fotoEstudiante.value = null;
      certificadoEstudiante.value = null;
      encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
      encargadoSeleccionado.value = null;
      encargadoManual.value = false;
      encargadoConfirmado.value = false;
      
      salud.value = { enfermedades: [], discapacidades: [], medicamentos: [] };
      
      gradoSelected.value = "";
      turnoSelected.value = "";
      repiteGrado.value = "";
    }
  };

  const seleccionarEstudiante = (estudianteObj) => {
    const clon = JSON.parse(JSON.stringify(estudianteObj));
    estudianteSeleccionado.value = clon;
    
    estudiante.value = {
      nombres: clon.nombres || "",
      NIE: clon.NIE || "",
    };

    pasoAntiguo.value = "formulario";
  };

  const seleccionarFotoEstudiante = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    fotoEstudiante.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const seleccionarCertificado = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    certificadoEstudiante.value = file;
  };

  const resetearTodo = () => {
    tipoMatricula.value = "";
    pasoAntiguo.value = "busqueda";
    pasoNuevo.value = "busqueda";
    estudianteSeleccionado.value = null;
    estudiantesBuscados.value = []; // <--- CORRECCIÓN: Limpia la lista de búsqueda
    estudiante.value = { nombres: "", NIE: "" };
    fotoEstudiante.value = null;
    fotoPreview.value = "";
    certificadoEstudiante.value = null;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
    encargadoSeleccionado.value = null;
    encargadoManual.value = false;
    encargadoConfirmado.value = false;
    
    salud.value = { enfermedades: [], discapacidades: [], medicamentos: [] };
    
    gradoSelected.value = "";
    turnoSelected.value = "";
    repiteGrado.value = "";
    pestañaActiva.value = "dato";
    erroresValidacion.value = null;
  };

  // --- ACCIONES DE ENCARGADO ---
  const seleccionarEncargado = (enc) => {
    encargadoSeleccionado.value = structuredClone(enc);
    encargado.value = {
      nombres: enc.nombre || "",
      dui: enc.dui || "",
      telefono: enc.telefono || "",
      parentescoId: enc.rol === "Padre" ? 2 : enc.rol === "Madre" ? 1 : "",
    };
    encargadoManual.value = false;
    encargadoConfirmado.value = false;
  };

  const agregarOtroEncargado = () => {
    encargadoSeleccionado.value = null;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
    encargadoManual.value = true;
    encargadoConfirmado.value = false;
  };

  const confirmarNuevoEncargado = () => {
    if (!encargado.value.nombres || !encargado.value.dui) {
      alert("Por favor, llena al menos el nombre completo y el DUI.");
      return;
    }
    encargadoConfirmado.value = true;
  };

  const resetFormularioEncargado = () => {
    encargadoConfirmado.value = false;
    encargado.value = { nombres: "", dui: "", telefono: "", parentescoId: "" };
  };

  const cancelarEncargadoManual = () => {
    encargadoManual.value = false;
    resetFormularioEncargado();
  };

  const obtenerDatosEncargadoEnvio = () => {
    if (encargadoManual.value) {
      return {
        esNuevo: true,
        datos: { ...encargado.value },
      };
    }
    return {
      esNuevo: false,
      id: encargadoSeleccionado.value ? encargadoSeleccionado.value.id : null,
    };
  };

  return {
    // Estados
    cargando,
    erroresValidacion,
    estadoMatricula,
    pestañaActiva,
    tipoMatricula,
    pasoAntiguo,
    pasoNuevo,
    estudianteSeleccionado,
    estudiante,
    fotoEstudiante,
    fotoPreview,
    certificadoEstudiante,
    encargado,
    encargadoSeleccionado,
    encargadoManual,
    encargadoConfirmado,
    salud,
    gradoSelected,
    turnoSelected,
    repiteGrado,
    parentescos,
    grados,
    turnos,
    enfermedades,
    discapacidades,
    medicamentos,
    estudiantesBuscados,
    // Computados
    esNuevoIngreso,
    esAntiguoIngreso,
    encargadosDisponibles,
    especialidadSelected,
    labelTipoMatricula,
    // Métodos API
    cargarCatalogos,
    buscarEstudiante,
    enviarMatriculaBackend,
    // Métodos Locales
    seleccionarTipoMatricula,
    seleccionarEstudiante,
    seleccionarEncargado,
    agregarOtroEncargado,
    confirmarNuevoEncargado,
    resetFormularioEncargado,
    cancelarEncargadoManual,
    obtenerDatosEncargadoEnvio,
    resetearTodo,
    seleccionarFotoEstudiante,
    seleccionarCertificado,
  };
});