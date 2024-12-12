import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data.js';

// Cargar variables de entorno
dotenv.config();

console.log("hola ejecutando en mailer.js");
console.log('Email User:', process.env.NODE_EMAIL_USER);
console.log('Email Pass:', process.env.NODE_EMAIL_PASS);

// Tarea que se ejecuta a las 12:01 AM
cron.schedule('1 0 * * *', async () => {  // Ejecutar a las 00:01 AM
  console.log('Tarea ejecutada a las 00:01 AM');

  try {
    // Obtener productos próximos a vencer
    console.log('Obteniendo productos próximos a vencer...');
    const productosProximos = await obtenerProductosAProximoVencer();
    console.log("productos Proximos a vencer en mailer:", productosProximos.length);

    productosProximos.forEach((producto) => {
      if (producto.notificado) {
        return;
      } else {
        const body = `
        <p>El producto ${producto.nombre} con lote ${producto.lote} está a punto de vencer en ${producto.mesesRestantes} meses, vencimiento: ${producto.fechaVencimiento}.</p>
        <p>
          <a href="https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto/${producto.id}" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px;">
             Notificado
          </a>
        </p>
        <p style="color: #ff0000;">
          Tenga en cuenta que una vez se notifique el aviso, ya no aparecerá la alerta sobre este producto.
        </p>
      `;
        console.log(body);
        sendEmailData('Aviso proximo a vencer', body);
      }
    });

    // Obtener productos vencidos
    console.log('Obteniendo productos vencidos...');
    const productosVencidos = await obtenerProductosVencidos();
    console.log("productos Vencidos en mailer:", productosVencidos.length);

    productosVencidos.forEach((producto) => {
      if (producto.notificado) {
        return;
      } else {
        const body = `
        <p>El producto ${producto.nombre} con lote ${producto.lote} ha vencido el dia: ${producto.fechaVencimiento}.</p>
        <p>
          <a href="https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto/${producto.id}" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px;">
             Notificado
          </a>
        </p>
        <p style="color: #ff0000;">
          Tenga en cuenta que una vez se notifique el aviso, ya no aparecerá la alerta sobre este producto.
        </p>
      `;
        console.log(body);
        sendEmailData('Aviso de vencimiento', body);
      }
    });
  } catch (error) {
    console.error('Error al ejecutar las funciones:', error);
  }
});

// Tarea que se ejecuta cada minuto
cron.schedule('*/5 * * * *', async () => {  // Ejecutar cada minuto
  console.log('Tarea ejecutada cada minuto');

  try {
    const body = `
    <p>El producto ${producto.nombre} con lote ${producto.lote} está a punto de vencer en ${producto.mesesRestantes} meses, vencimiento: ${producto.fechaVencimiento}.</p>
    <p>
      <a href="https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto" 
         style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px;">
         Notificado
      </a>
    </p>
    <p style="color: #ff0000;">
      ESTA TASREA SE ESTA EJECUTANDO COMO UNA PRUEBA Y EJECUCION AL ENVIO DE MENSAJES.
    </p>
  `;
    // Lógica de la tarea que se ejecuta cada minuto (puedes agregarla según tus necesidades)
    console.log('Ejecutando tarea periódica...');
    sendEmailData('TESTING DE NODECRON DESPLEGAdo', body)
    // Aquí puedes agregar el código que deseas ejecutar cada minuto
  } catch (error) {
    console.error('Error al ejecutar la tarea cada minuto:', error);
  }
});

//? Envio de mensaje con nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_EMAIL_USER,  // Tu dirección de correo
    pass: process.env.app_password_gmail,  // Contraseña de la cuenta o contraseña de aplicación
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmailData = async (subject, body) => {
  const mailOptions = {
    from: process.env.NODE_EMAIL_USER,
    to: process.env.NODE_TO,
    subject,
    html: body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
