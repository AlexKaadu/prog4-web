// ESTE ARCHIVO SIRVE PARA INSERTAR DINAMICAMENTE EL NOMBRE DEL CARGO DEPENDIENDO DEL USUARIO

import headerHTML from './templates/header-template.html?raw';

export function mostrarHeader(cargo) {
    const html = headerHTML.replace('{{CARGO}}', cargo);
    document.getElementById('plantilla').innerHTML = html;
}