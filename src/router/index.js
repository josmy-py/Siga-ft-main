import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { ROLES } from "@/constants/roles";

// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import ClienteLayout from "../layouts/ClienteLayout.vue";

// Vistas principales
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

// Cliente
import DashboardCliente from "../modules/Cliente/DashboardCliente.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // =========================================================
    // PÚBLICAS
    // =========================================================

    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { soloInvitados: true },
    },

    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { soloInvitados: true },
    },

    {
      path: "/activar",
      name: "activar-cuenta",
      component: () => import("../views/ActivarCuenta.vue"),
    },

    {
      path: "/olvide-contrasena",
      name: "olvide-contrasena",
      component: () => import("../views/OlvideContrasena.vue"),
      meta: { soloInvitados: true },
    },

    {
      path: "/restablecer-contrasena",
      name: "restablecer-contrasena",
      component: () => import("../views/RestablecerContrasena.vue"),
    },

    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },

    // =========================================================
    // CLIENTE
    // =========================================================

    {
      path: "/cliente",
      component: ClienteLayout,
      meta: { requiresAuth: true, roles: [ROLES.ENCARGADO] },
      children: [
        {
          path: "dashboard",
          name: "dashboard-cliente",
          component: DashboardCliente,
        },

        {
          path: "perfil",
          name: "perfil-cliente",
          component: () => import("../modules/Cliente/PerfilCliente.vue"),
        },

        {
          path: "registro",
          name: "registro-cliente",
          component: () => import("../modules/Cliente/ListaCliente.vue"),
        },

        {
          path: "matricula",
          name: "matricula-cliente",
          component: () => import("../modules/Cliente/GestionEstudiante.vue"),
        },

        {
          path: "matriculas",
          name: "matriculas-cliente",
          component: () => import("../modules/Cliente/MatriculaEstudiante.vue"),
        },

        {
          path: "boleta",
          name: "boleta-cliente",
          component: () => import("../modules/Cliente/BoletaCliente.vue"),
        },

        {
          path: "asignaturas",
          name: "asignaturas-cliente",
          component: () => import("../modules/Cliente/AsignaturasCliente.vue"),
        },

        {
          path: "padres",
          name: "registro-padres",
          component: () => import("../modules/Cliente/RegistroPadres.vue"),
        },

        {
          path: "avisos",
          name: "avisos-cliente",
          component: () => import("../modules/Cliente/AvisosCliente.vue"),
        },

        {
          path: "contrasena",
          name: "contrasena-cliente",
          component: () => import("../views/CambiarContrasena.vue"),
        },
      ],
    },

    // =========================================================
    // DOCENTE
    // =========================================================

    {
      path: "/docente",
      component: () => import("../layouts/DocenteLayout.vue"),
      meta: { requiresAuth: true, roles: [ROLES.DOCENTE] },
      children: [
        {
          path: "dashboard",
          name: "dashboard-docente",
          component: () => import("../modules/Docente/DashboardDocente.vue"),
        },

        {
          path: "perfil",
          name: "perfil-docente",
          component: () => import("../modules/Docente/PerfilDocente.vue"),
        },

        {
          path: "asignaturas",
          name: "asignaturas-docente",
          component: () => import("../modules/Docente/AsignaturasDocente.vue"),
        },

        {
          path: "notas",
          name: "notas-docente",
          component: () => import("../modules/Docente/NotasDocente.vue"),
        },

        {
          path: "estudiantes",
          name: "estudiantes-docente",
          component: () => import("../modules/Docente/EstudiantesDocente.vue"),
        },

        {
          path: "avisos",
          name: "avisos-docente",
          component: () => import("../modules/Docente/AvisosDocente.vue"),
        },

        {
          path: "conducta",
          name: "conducta-docente",
          component: () => import("../modules/Docente/ConductaDocente.vue"),
        },

        {
          path: "reportes",
          name: "reportes-docente",
          component: () => import("../views/docente/ReportesView.vue"),
        },

        {
          path: "grados-secciones",
          name: "grados-secciones-docente",
          component: () => import("../modules/Docente/GradosSeccionesDocente.vue"),
        },

        {
          path: "contrasena",
          name: "contrasena-docente",
          component: () => import("../views/CambiarContrasena.vue"),
        },
      ],
    },

    // =========================================================
    // ADMINISTRADOR
    // =========================================================

    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, roles: [ROLES.DIRECTOR] },

      children: [
        {
          path: "dashboard",
          name: "dashboard-admin",
          component: () => import("../modules/Admin/Dashboard.vue"),
        },

        {
          path: "gestion-usuarios",
          name: "gestion-usuarios-admin",
          component: () => import("../modules/Admin/Tables/TablaUsuarios.vue"),
        },

        {
          path: "estudiantes",
          name: "estudiantes-admin",
          component: () => import("../views/admin/EstudianteView.vue"),
        },

        {
          path: "matricula",
          name: "matricula-admin",
          component: () => import("../views/admin/MatriculasView.vue"),
        },

        {
          path: "profesores",
          name: "profesores-admin",
          component: () => import("../modules/Admin/Tables/TablaProfesor.vue"),
        },

        {
          path: "asignaciones",
          name: "asignaciones-admin",
          component: () => import("../views/admin/AsignacionView.vue"),
        },

        {
          path: "reporte",
          name: "reporte-admin",
          component: () => import("../views/admin/ReportesView.vue"),
        },
        {
          path: "constancia",
          name: "constancia-admin",
          component: () => import("../modules/Admin/Forms/constancias/egresadoPDF.vue"),
        },

        {
          path: "catalogos",
          name: "catalogos-admin",
          component: () => import("../modules/Admin/GestionAdmin.vue"),
        },

        {
          path: "contrasena",
          name: "contrasena-admin",
          component: () => import("../views/CambiarContrasena.vue"),
        },
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Guardas de navegación. Solo controlan qué pantallas se muestran: la
// autorización real la hace el backend en cada petición.
const MOTIVOS_CIERRE = ["sesion_revocada", "cuenta_inactiva", "cuenta_pendiente"];

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Token guardado pero vencido: se descarta la sesión local
  if (auth.token && !auth.tokenVigente) {
    auth.limpiarSesion();
  }

  // Primera navegación con sesión guardada: se confirma con el backend (rol y estado actuales)
  let motivo = null;
  if (auth.token && !auth.verificado) {
    try {
      await auth.me();
    } catch (error) {
      // Se conserva el motivo (contraseña cambiada, cuenta desactivada) para mostrarlo en el login
      const codigo = error?.response?.data?.codigo;
      if (MOTIVOS_CIERRE.includes(codigo)) motivo = codigo;
      auth.limpiarSesion();
    }
  }

  const requiereSesion = to.matched.some((r) => r.meta.requiresAuth);

  if (requiereSesion && !auth.autenticado) {
    return { name: "login", query: { redirect: to.fullPath, ...(motivo ? { motivo } : {}) } };
  }

  if (requiereSesion) {
    const rolesPermitidos = to.matched.flatMap((r) => r.meta.roles ?? []);
    if (rolesPermitidos.length && !rolesPermitidos.includes(auth.rol)) {
      return auth.rutaInicio;
    }
  }

  if (to.meta.soloInvitados && auth.autenticado) {
    return auth.rutaInicio;
  }

  return true;
});

export default router;
