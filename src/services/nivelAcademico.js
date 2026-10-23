// Nivel académico de los periodos (periodo_escolares.nivel, 23/10/2026):
// 1 = Parvularia y Educación Básica, 2 = Bachillerato. Cada sección usa solo
// los periodos de su nivel; el catálogo cerrado de grados llama "bachillerato"
// a los únicos grados del nivel 2.
export const NIVELES_ACADEMICOS = [
  { valor: 1, texto: 'Parvularia y Educación Básica' },
  { valor: 2, texto: 'Bachillerato' },
]

export const nivelDeGrado = (gradoNombre) => {
  if (!gradoNombre) return null
  return /bachillerato/i.test(gradoNombre) ? 2 : 1
}

export const textoNivelAcademico = (nivel) => NIVELES_ACADEMICOS.find((n) => n.valor === Number(nivel))?.texto ?? ''

// Periodos del nivel del grado; sin grado elegido, todos
export const periodosDelGrado = (periodos, gradoNombre) => {
  const nivel = nivelDeGrado(gradoNombre)
  return nivel ? (periodos ?? []).filter((p) => Number(p.nivel) === nivel) : periodos ?? []
}
