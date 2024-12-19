import path from 'path';

// Función para manejar la descarga del archivo PDF
export const downloadManual = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'pdfFiles', 'manualAPPLABAKC.pdf');
  
  res.download(filePath, 'manualAPPLABAKC.pdf', (err) => {
    if (err) {
      console.error('Error al intentar descargar el archivo:', err);
      return res.status(500).send('Error al intentar descargar el archivo.');
    }
    res.status(200);  // Opcional, ya que 'res.download' ya maneja el estado
  });
};
