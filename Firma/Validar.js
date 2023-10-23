const fs = require('fs');
const path = require('path');

// Función para listar los archivos de una carpeta
function listFilesInDirectory(directory) {
  return fs.readdirSync(directory).filter(file => fs.statSync(path.join(directory, file)).isFile());
}

// Función para comparar dos carpetas
function compareFolders(folder1, folder2) {
  const filesInFolder1 = listFilesInDirectory(folder1);
  const filesInFolder2 = listFilesInDirectory(folder2);

  const uniqueFilesInFolder1 = filesInFolder1.filter(file => !filesInFolder2.includes(file));
  const uniqueFilesInFolder2 = filesInFolder2.filter(file => !filesInFolder1.includes(file));

  if (uniqueFilesInFolder1.length > 0) {
    console.log(`Archivos únicos en ${folder1}:`);
    console.log(uniqueFilesInFolder1);
  }

  if (uniqueFilesInFolder2.length > 0) {
    console.log(`Archivos únicos en ${folder2}:`);
    console.log(uniqueFilesInFolder2);
  }

  if (uniqueFilesInFolder1.length === 0 && uniqueFilesInFolder2.length === 0) {
    console.log('Las Firmas en todos los archivos son idénticas.');
  }
}

// Rutas de las carpetas a comparar
const folder1Path = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Decrypt';
const folder2Path = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Firmas';

compareFolders(folder1Path, folder2Path);