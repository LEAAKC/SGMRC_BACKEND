import fs from 'fs';
import path from 'path';

// Función para manejar la descarga del archivo PDF
export const downloadManual = (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'pdfFiles', 'manualAPPLABAKC.pdf');
  
  // Verificar si la ruta está bien construida
  console.log('File Path:', filePath);

  // Verificar si el archivo existe
  fs.exists(filePath, (exists) => {
    if (!exists) {
      console.error('El archivo no existe en la ruta especificada');
      return res.status(404).send('El archivo no se encuentra disponible.');
    }

    // Si el archivo existe, proceder con la descarga
    res.download(filePath, 'manualAPPLABAKC.pdf', (err) => {
      if (err) {
        console.error('Error al intentar descargar el archivo:', err);
        return res.status(500).send('Error al intentar descargar el archivo.');
      }
      res.status(200);  // Opcional, ya que 'res.download' ya maneja el estado
    });
  });
};
