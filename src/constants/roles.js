// Roles del backend (tabla roles del diagrama) y su etiqueta visible.
// El backend es la autoridad: estos valores solo sirven para navegar y mostrar.
export const ROLES = Object.freeze({
  DIRECTOR: 'DIRECTOR',
  DOCENTE: 'DOCENTE',
  ENCARGADO: 'ENCARGADO',
})

export const ROL_ETIQUETAS = Object.freeze({
  DIRECTOR: 'Director / Administrador',
  DOCENTE: 'Profesor',
  ENCARGADO: 'Encargado',
})

export const ROL_OPCIONES = Object.values(ROLES).map((valor) => ({
  valor,
  etiqueta: ROL_ETIQUETAS[valor],
}))

// Pantalla de inicio de cada rol después de iniciar sesión
export const RUTA_INICIO_POR_ROL = Object.freeze({
  DIRECTOR: 'estudiantes-admin',
  DOCENTE: 'notas-docente',
  ENCARGADO: 'inicio-cliente',
})

// Cambio de contraseña dentro del área de cada rol
export const RUTA_CONTRASENA_POR_ROL = Object.freeze({
  DIRECTOR: 'contrasena-admin',
  DOCENTE: 'contrasena-docente',
  ENCARGADO: 'contrasena-cliente',
})

export const etiquetaRol = (rol) => ROL_ETIQUETAS[rol] ?? 'Sin rol'
