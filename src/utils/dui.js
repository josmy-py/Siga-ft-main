// Verificación previa del DUI en el navegador (mismo algoritmo que App\Rules\Dui).
// Es solo una ayuda para el usuario: el backend vuelve a normalizar y validar.

export const normalizarDui = (valor) => {
  const digitos = String(valor ?? '').replace(/[\s-]/g, '')
  return /^\d{9}$/.test(digitos) ? `${digitos.slice(0, 8)}-${digitos.slice(8)}` : String(valor ?? '').trim()
}

export const duiValido = (valor) => {
  const digitos = String(valor ?? '').replace(/[\s-]/g, '')
  if (!/^\d{9}$/.test(digitos)) return false

  let suma = 0
  for (let i = 0; i < 8; i++) suma += Number(digitos[i]) * (9 - i)

  return (10 - (suma % 10)) % 10 === Number(digitos[8])
}
