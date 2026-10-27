const formulario = document.getElementById('form-login');
const mensaje = document.getElementById('mensaje-login');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const usuario = document.getElementById('usuario').value.trim();
    const contrasenia = document.getElementById('contrasenia').value;

    try {
        const respuesta = await fetch(
            'http://localhost:3000/api/v1/autenticacion/login',

            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({usuario, contrasenia})
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok){
            mensaje.textContent =
                datos.mensaje || datos.error || 'No se pudo iniciar sesión.';
            return;
        }
        sessionStorage.setItem('token', datos.token);

        const pantallasPorRol = {
            1: '/src/pages/director/director-sistemas-dashboard.html',
            2: '/src/pages/empleado-sistemas/empleado-sistemas-incidencias.html',
            3: 'src/pages/empleado-municipal/empleado-municipal-nueva-incidencia.html'
        };

        const pantalla = pantallasPorRol[Number(datos.usuario.rol)];

        if(!pantalla) {
            mensaje.textContent = 'El usuario no tiene un rol reconocido';
            return
        }

        window.location.href = pantalla;

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mensaje.textContent = 'No se pudo conectar al servidor.';
    }
});