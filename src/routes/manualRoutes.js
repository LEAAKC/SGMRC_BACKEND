import express from 'express';
const router = express.Router();
import {pdfController} from '../controllers/manualController.js'

// Definir la ruta para la descarga del archivo PDF
router.get('/downloadpdf', pdfController.downloadPdf);

module.exports = router;
