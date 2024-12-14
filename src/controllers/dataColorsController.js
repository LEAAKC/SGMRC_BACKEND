import { Types } from 'mongoose';
const { ObjectId } = Types;

// controllers/dataColors.controller.js
import DataColors from '../models/dataColorsModels.js';


// Crear un nuevo datos
export const createDataColors = async (req, res) => {
  try {
    const dataColors = new DataColors(req.body); // req.body contiene los datos del datos
    await dataColors.save();
    res.status(201).json(dataColors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reemplazar toda la dataColors
export const replaceAllDataColors = async (req, res) => {
  try {
    // Borrar todos los datos existentes
    await DataColors.deleteMany({});

    // Insertar la nueva dataColors
    const newDataColors = await DataColors.insertMany(req.body); // req.body contiene la nueva dataColors

    // Retornar la nueva dataColors insertada
    res.status(200).json(newDataColors);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los datoss
export const getAllDataColorss = async (req, res) => {
  try {
    const dataColorss = await DataColors.find();
    res.status(200).json(dataColorss);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un datos por ID
export const getDataColorsById = async (req, res) => {
  try {
    const dataColors = await DataColors.findById(req.params.id);
    if (!dataColors) {
      return res.status(404).json({ message: 'Datos no encontrado' });
    }
    res.status(200).json(dataColors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un datos
export const updateDataColors = async (req, res) => {
  try {
    const dataColors = await DataColors.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dataColors) {
      return res.status(404).json({ message: 'Datos no encontrado' });
    }
    res.status(200).json(dataColors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un datos
export const deleteDataColors = async (req, res) => {
  console.log("id que llega al delete:", req.params.id);

  // Validación del ObjectId
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Id no válido' });
  }

  try {
    // Intentar eliminar el documento
    const dataColors = await DataColors.findByIdAndDelete(req.params.id);

    // Verificar si el documento fue encontrado y eliminado
    console.log("Documento eliminado:", dataColors);

    if (!dataColors) {
      // Si el documento no se encuentra, enviar mensaje de error
      return res.status(404).json({ message: 'Fila no encontrada' });
    }

    // Si se eliminó correctamente, enviar un mensaje de éxito
    return res.status(200).json({ message: 'Fila eliminada correctamente', dataColors });

  } catch (error) {
    // En caso de error en la base de datos
    console.error("Error al eliminar:", error);
    return res.status(400).json({ error: error.message });
  }
};

