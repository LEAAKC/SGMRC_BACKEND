import { mongoose } from 'mongoose';
import { URI } from '../keys/key.js';
import bcrypt from 'bcrypt';
import moment from 'moment';
import Data from '../models/dataModels.js'; // Asegúrate de que este modelo esté importado correctamente
import DataColors from '../models/dataColorsModels.js'; // Asegúrate de que este modelo esté importado correctamente

const db = (async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 30000,  // Aumenta el timeout a 30 segundos
      socketTimeoutMS: 45000,  // Aumenta el tiempo de espera en el socket
    });
    console.log("Conectado a la base de datos");

    // Verificar si existe algún registro en la colección 'Data'
    const count = await Data.countDocuments();

    if (count === 0) {
      // Si no hay registros, crear un registro por defecto
      const defaultData = new Data({
        fechaSolicitud: new Date('2024-10-31'),
        codigoInventario: 'ABC123456',
        nombre: 'Producto Ejemplo',
        marca: 'Producto Ejemplo',
        lote: 'PRK32KJJ',
        tipo: 'Producto químico',
        area: 'Laboratorio',
        fechaIngreso: new Date('2024-10-31'),
        fechaVencimiento: new Date('2024-10-31'),
        fechaActualizacionInformacion: new Date('2024-10-31'),
        cantidadIngreso: 150,
        manipulacion: 'Seguridad estándar',
        almacenamiento: 'A temperatura controlada',
        certificadoAnalisis: true,
        responsable: 'Juan Pérez',
        observaciones: 'Producto sin daños',
        vencimiento: '2024/11/31',
        mesesRestantes: 12
      });

      // Guardar el registro por defecto en la colección 'Data'
      await defaultData.save();
      console.log("Se creó un registro por defecto en la colección Data");
    } else {
      console.log("Ya existen registros en la colección Data");
    }

    // Verificar si existe algún registro en la colección 'DataColors'
    const countDataColors = await DataColors.countDocuments();

    if (countDataColors === 0) {
      // Si no hay registros, crear un registro por defecto en la colección 'DataColors'
      const defaultDataColors = new DataColors({
        Reactivo: '----',
        Marca: '----',
        Codigo: '----',
        Lote: '----',
        fechaVencimiento: '--/--/--', 
        CAS: '----', 
        Color: '----',
        Accion: '----'
      });

      // Guardar el registro por defecto en la colección 'DataColors'
      await defaultDataColors.save();
      console.log("Se creó un registro por defecto en la colección DataColors");
    } else {
      console.log("Ya existen registros en la colección DataColors");
    }

  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
})();

export default db;
