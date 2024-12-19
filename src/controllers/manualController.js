import path from 'path';

// Función para manejar la descarga del archivo PDF
exports.downloadPdf = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'pdfFiles', 'manualAPPLABAKC.pdf');
  
  res.download(filePath, 'manualAPPLABAKC.pdf', (err) => {
    if (err) {
      console.error('Error al intentar descargar el archivo:', err);
      return res.status(500).send('Error al intentar descargar el archivo.');
    }else{
      res.status(200)
    }
  });
};
