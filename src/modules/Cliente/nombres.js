// Nombre de persona: solo letras (con tildes y ñ) y espacios
export const soloLetras = (texto) => texto.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g, "").replace(/ {2,}/g, " ");
export const PATRON_NOMBRE = "[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+";
