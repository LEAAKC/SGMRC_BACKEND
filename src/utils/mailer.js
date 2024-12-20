import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { obtenerProductosAProximoVencer, obtenerProductosVencidos } from './data/data.js';

// Cargar variables de entorno
dotenv.config();

// Tarea que se ejecuta a las 12:01 AM
cron.schedule('*/5 * * * *', async () => {  // Ejecutar CADA 24 HORAS
  console.log('Cron de 5 minutos ejecutado');

  try {
    // Almacenar los productos a notificar
    const productosProximos = [];
    const productosVencidos = [];

    // Obtener productos próximos a vencer
    console.log('Obteniendo productos próximos a vencer...');
    const productosProximosA = await obtenerProductosAProximoVencer();

    // Almacenar los productos próximos a vencer en un array
    productosProximosA.forEach((producto) => {
      if (!producto.notificado) {
        productosProximos.push({
          nombre: producto.nombre,
          lote: producto.lote,
          fechaVencimiento: producto.fechaVencimiento,
          mesesRestantes: producto.mesesRestantes,
          id: producto.id
        });
      }
    });

    // Obtener productos vencidos
    console.log('Obteniendo productos vencidos...');
    const productosVencidosA = await obtenerProductosVencidos();

    // Almacenar los productos vencidos en un array
    productosVencidosA.forEach((producto) => {
      if (!producto.notificado) {
        productosVencidos.push({
          nombre: producto.nombre,
          lote: producto.lote,
          fechaVencimiento: producto.fechaVencimiento,
          id: producto.id
        });
      }
    });

    console.log('Productos próximos a vencer:', productosProximos);
console.log('Productos vencidos:', productosVencidos);

    // Generar un timestamp único para cada ejecución
    const timestamp = new Date().toISOString();  // Genera un timestamp único

    // Si hay productos próximos a vencer, enviamos un correo con asunto único
    if (productosProximos.length > 0) {
      const bodyProximos = generateEmailBody(productosProximos, 'Próximos a vencer');
      sendEmailData(`Listado de productos próximos a vencer - ${timestamp}`, bodyProximos);
    }

    // Si hay productos vencidos, enviamos un correo con asunto único
    if (productosVencidos.length > 0) {
      const bodyVencidos = generateEmailBody(productosVencidos, 'Vencidos');
      sendEmailData(`Listado de productos vencidos - ${timestamp}`, bodyVencidos);
    }

  } catch (error) {
    console.error('Error al ejecutar las funciones:', error);
  }
});

// Función para generar el contenido HTML del correo
const generateEmailBody = (productos, tipo) => {
  let htmlContent = `<h2>Listado de productos ${tipo}</h2>`;
  productos.forEach((producto) => {
    htmlContent += `
      <p><strong>Producto:</strong> ${producto.nombre}</p>
      <p><strong>Lote:</strong> ${producto.lote}</p>
      <p><strong>Fecha de Vencimiento:</strong> ${producto.fechaVencimiento}</p>
      ${tipo === 'Próximos a vencer' ? `<p><strong>Meses restantes:</strong> ${producto.mesesRestantes}</p>` : ''}
      <p>
        <a href="https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto/${producto.id}" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px;">
           Notificar
        </a>
      </p>
      <p style="color: #ff0000;">
        Tenga en cuenta que una vez se notifique el aviso, ya no aparecerá la alerta sobre este producto.
      </p>
      <hr />
    `;
  });
  return htmlContent;
};

// Tarea que se ejecuta cada minuto
cron.schedule('*/10 * * * *', async () => {  // Ejecutar cada minuto
  console.log('Cron de 10 minutos ejecutado');

  try {
    const date = new Date();  // Obtén la fecha y hora actual
    const currentTime = date.toLocaleString();  // Formatea la hora en formato local
    
    const body = `
      <p>ESTE ES UN CORREO DE TEST PARA MONITOREAR QUE LA APP NO ENTRE EN SUSPENSIÓN</p>
      <p>
        <a href="https://sgmrcbackend-production.up.railway.app/api/email/notificar-producto" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; font-size: 16px; border-radius: 5px;">
           Notificar
        </a>
      </p>
      <p style="color: #ff0000;">
        ESTA TAREA SE ESTÁ EJECUTANDO COMO UNA PRUEBA Y EJECUCIÓN AL ENVÍO DE MENSAJES.
      </p>
      <p><strong>Hora de ejecución:</strong> ${currentTime}</p>  <!-- Aquí agregamos la hora -->
    `;
    
    console.log('Ejecutando tarea periódica...');
    // Generamos un timestamp único para este correo
    const timestamp = new Date().toISOString();
    sendEmailData(`TESTING CADA 5 MINUTOS - ${timestamp}`, body);  // Asunto único con timestamp
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

// Función para enviar el correo
export const sendEmailData = async (subject, body) => {
  const mailOptions = {
    from: process.env.NODE_EMAIL_USER,
    to: process.env.NODE_TO,
    cc: process.env.NODE_TO_COPIA,
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
