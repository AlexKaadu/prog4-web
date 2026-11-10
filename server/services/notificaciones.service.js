import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

class NotificacionesServicio {
    // Renderiza la plantilla del mensaje y envía el correo con Nodemailer.
    enviarCorreo = async (datosCorreo) => {
        if (!process.env.CORREO || !process.env.CLAVE) {
            throw new Error('Faltan las variables CORREO y CLAVE para enviar correos.');
        }

        const rutaActual = fileURLToPath(import.meta.url);
        const directorioActual = path.dirname(rutaActual);
        const plantillaPath = path.join(
            directorioActual,
            '../utiles/handlebars/plantilla.hbs'
        );
        const plantillaTemp = fs.readFileSync(plantillaPath, 'utf8');
        const plantilla = handlebars.compile(plantillaTemp);
        const correoHtml = plantilla(datosCorreo);
        const estado = datosCorreo.estado;
        const asunto = `Incidencia ${estado}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CORREO,
                pass: process.env.CLAVE
            }
        });

        return transporter.sendMail({
            from: process.env.CORREO,
            to: datosCorreo.destinatario,
            subject: asunto,
            html: correoHtml
        });
    };
}

export default NotificacionesServicio;
