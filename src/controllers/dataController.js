import { Types } from 'mongoose';
const { ObjectId } = Types;

// controllers/data.controller.js
import Data from '../models/dataModels.js';


// Crear un nuevo datos
export const createData = async (req, res) => {
  try {
    const data = new Data(req.body); // req.body contiene los datos del datos
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reemplazar toda la data
export const replaceAllData = async (req, res) => {
  try {
    // Borrar todos los datos existentes
    await Data.deleteMany({});

    // Insertar la nueva data
    const newData = await Data.insertMany(req.body); // req.body contiene la nueva data

    // Retornar la nueva data insertada
    res.status(200).json(newData);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los datoss
export const getAllDatas = async (req, res) => {
  try {
    const datas = await Data.find();
    res.status(200).json(datas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un datos por ID
export const getDataById = async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Datos no encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un datos
export const updateData = async (req, res) => {
  try {
    const data = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      return res.status(404).json({ message: 'Datos no encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un datos
export const deleteData = async (req, res) => {
  console.log("id que llega al delete:", req.params.id);

  // Validación del ObjectId
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Id no válido' });
  }

  try {
    // Intentar eliminar el documento
    const data = await Data.findByIdAndDelete(req.params.id);

    // Verificar si el documento fue encontrado y eliminado
    console.log("Documento eliminado:", data);

    if (!data) {
      // Si el documento no se encuentra, enviar mensaje de error
      return res.status(404).json({ message: 'Fila no encontrada' });
    }

    // Si se eliminó correctamente, enviar un mensaje de éxito
    return res.status(200).json({ message: 'Fila eliminada correctamente', data });

  } catch (error) {
    // En caso de error en la base de datos
    console.error("Error al eliminar:", error);
    return res.status(400).json({ error: error.message });
  }
};

