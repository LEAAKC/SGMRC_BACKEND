import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data.js';

// Cargar variables de entorno
dotenv.config();

console.log("hola enejcutando en mailer.js");
// console.log('Email User:', process.env.NODE_EMAIL_USER);
// console.log('Email Pass:', process.env.NODE_EMAIL_PASS);

//^  ejecucion de nodecron

cron.schedule('0 * * * *', async () => {  // Ejecutar cada minuto
  console.log("Ejecutando node-cron a las 11:35");

  try {

    // Obtener productos próximos a vencer
    console.log('Obteniendo productos próximos a vencer...');
    const productosProximos = await obtenerProductosAProximoVencer();
    console.log("productos Proximos a vencer en mailer:", productosProximos);

    productosProximos.forEach((producto) => {
      if(producto.notificado){
        return;
      }else{
        const body = `
        <p>El producto ${producto.nombre} con lote ${producto.lote} está a punto de vencer en ${producto.mesesRestantes} meses, vencimiento: ${producto.fechaVencimiento}.</p>
        <p>
          <a href="http://localhost:4041/api/email/notificar-producto/${producto.id}" 
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
    console.log("productos Vencidos en mailer:", productosVencidos);

    productosVencidos.forEach((producto) => {
      if(producto.notificado){
        return;
      }else{
        const body = `
        <p>El producto ${producto.nombre} con lote ${producto.lote} ha vencido el dia: ${producto.fechaVencimiento}.</p>
        <p>
          <a href="http://localhost:4041/api/email/notificar-producto/${producto.id}" 
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


//?  envio de mensaje con nodemailes
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
    //text: body,
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
