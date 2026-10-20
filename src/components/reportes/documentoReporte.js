import Swal from 'sweetalert2'

// Documento imprimible de los formularios de Reportes del director. No se
// guarda en la base de datos: se abre en una ventana nueva y el navegador lo
// imprime o lo guarda como PDF.

export const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const fechaLegible = (iso) => {
  if (!iso) return ''
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export const escapar = (texto) =>
  String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export const porcentaje = (v) => (v === '' || v === null || v === undefined ? '' : `${v} %`)

// Bloques del documento
export const dato = (etiqueta, valor) =>
  `<div class="dato"><span>${etiqueta}</span><strong>${escapar(valor) || '—'}</strong></div>`
export const fila = (...datos) => `<div class="fila c${datos.length}">${datos.join('')}</div>`
export const seccion = (titulo, contenido) => `<h2>${titulo}</h2>${contenido}`
export const texto = (valor) => `<p class="texto">${escapar(valor) || '—'}</p>`

const ESTILOS = `
  body { font-family: Arial, sans-serif; color: #1f2937; margin: 32px; font-size: 13px; }
  .encabezado { background: linear-gradient(90deg, #4f46e5, #7c3aed); color: #fff; padding: 18px 22px; border-radius: 10px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .encabezado h1 { margin: 0 0 4px; font-size: 22px; }
  .encabezado p { margin: 0; font-size: 12px; }
  h2 { font-size: 15px; color: #4c1d95; border-bottom: 1px solid #ddd6fe; padding-bottom: 4px; margin: 22px 0 10px; }
  .fila { display: grid; gap: 10px; margin-bottom: 10px; }
  .fila.c1 { grid-template-columns: 1fr; }
  .fila.c2 { grid-template-columns: repeat(2, 1fr); }
  .fila.c3 { grid-template-columns: repeat(3, 1fr); }
  .fila.c4 { grid-template-columns: repeat(4, 1fr); }
  .dato { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; }
  .dato span { display: block; font-size: 11px; color: #6b7280; }
  .texto { white-space: pre-wrap; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; min-height: 40px; margin: 0; }
  .pie { margin-top: 40px; font-size: 11px; color: #6b7280; text-align: center; }
  .firma { margin: 60px auto 0; width: 260px; border-top: 1px solid #374151; text-align: center; padding-top: 6px; }
`

// cuerpo: HTML armado con seccion/fila/dato/texto. firma: [nombre, cargo]
export const imprimirReporte = ({ titulo, subtitulo, cuerpo, firma = [] }) => {
  const ventana = window.open('', '_blank')
  if (!ventana) {
    Swal.fire({ icon: 'warning', title: 'Permita las ventanas emergentes para generar el PDF.' })
    return
  }
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapar(titulo)}</title>
<style>${ESTILOS}</style></head><body>
<div class="encabezado"><h1>${escapar(titulo)}</h1><p>${escapar(subtitulo)}</p></div>
${cuerpo}
<div class="firma">${firma.map(escapar).join('<br>')}</div>
<div class="pie">Generado por SIGA el ${fechaLegible(hoy())}</div>
</body></html>`
  ventana.document.open()
  ventana.document.write(html)
  ventana.document.close()
  ventana.focus()
  setTimeout(() => ventana.print(), 300)
}
