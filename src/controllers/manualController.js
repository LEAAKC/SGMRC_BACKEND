import path from 'path';

// Función para manejar la descarga del archivo PDF
export const downloadManual = (req, res) => {
  // Obtener la ruta del archivo correctamente
  const filePath = path.join(process.cwd(), 'public', 'pdfFiles', 'manualAPPLABAKC.pdf');
  
  // Verificar si la ruta está bien construida
  console.log('File Path:', filePath);

  // Intentar descargar el archivo
  res.download(filePath, 'manualAPPLABAKC.pdf', (err) => {
    if (err) {
      console.error('Error al intentar descargar el archivo:', err);
      return res.status(500).send('Error al intentar descargar el archivo.');
    }
    res.status(200);  // Opcional, ya que 'res.download' ya maneja el estado
  });
};
