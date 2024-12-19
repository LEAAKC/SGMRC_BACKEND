import express from 'express';
const router = express.Router();
import {downloadPdf} from '../controllers/manualController.js'

// Definir la ruta para la descarga del archivo PDF
router.get('/downloadpdf', downloadPdf);

module.exports = router;
