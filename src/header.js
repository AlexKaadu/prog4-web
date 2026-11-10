// Inserta el encabezado compartido y muestra el nombre y cargo del usuario.

import headerHTML from './templates/header-template.html?raw';

/** Renderiza el encabezado de la página para el cargo indicado. */
export function mostrarHeader(cargo) {
    const html = headerHTML.replace('{{CARGO}}', cargo);
    document.getElementById('plantilla').innerHTML = html;
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const nombre = document.querySelector('.usuario-nombre');

    nombre.textContent = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();
}