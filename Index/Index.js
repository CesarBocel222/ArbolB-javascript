const fs = require('fs');
const BTree = require('../Btree/Btree.js');
const prompt = require('prompt-sync')();
const KeyValuePair = require('../Btree/KeyValuePair.js');
const SDES = require('../CifradoSDES/SDES.js');
const RSA = require('../Firma/RSA.js');
const path = require('path');
const inputFolder = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Firmas';
const encryptFolder = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Encrypt';
const decryptFolder = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Decrypt';
let continuar = false;
console.log("Bienvenido!");
RSA
//Incriptacion de las cartas firmadas
 if (!fs.existsSync(encryptFolder)) {
    fs.mkdirSync(encryptFolder);
}

if (!fs.existsSync(decryptFolder)) {
    fs.mkdirSync(decryptFolder);
}
// Lee la lista de archivos en la carpeta de entrada
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error al leer la carpeta de entrada:', err);
        return;
    }
    // Recorre cada archivo en la carpeta de entrada
    files.forEach((file) => {
        const inputFile = path.join(inputFolder, file);
        const outputFileEncrypt = path.join(encryptFolder, file);
        const outputFileDecrypt = path.join(decryptFolder, file);
        
        // Lee el contenido del archivo de entrada
        fs.readFile(inputFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo de entrada:', err);
                return;
            }
            
            // Crear una instancia de la clase SDES con tu clave
            const sdes = new SDES([1, 0, 1, 0, 0, 1, 0, 0, 1, 1]);
            
            // Llama a la función encryptString para cifrar el contenido
            const encryptedBlocks = sdes.encryptString(data);
            
            // Convierte los bloques cifrados en una cadena y guárdalos en el archivo de salida cifrado
            const encryptedData = encryptedBlocks.map(block => block.join('')).join('');
            fs.writeFile(outputFileEncrypt, encryptedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo cifrado:', err);
                    return;
                }
                
                console.log(`Archivo cifrado '${outputFileEncrypt}' guardado correctamente.`);
            });
            
            // Llama a la función decryptBlocks para descifrar el contenido
            const decryptedText = sdes.decryptBlocks(encryptedBlocks);
            
            // Escribe el texto descifrado en el archivo de salida descifrado
            fs.writeFile(outputFileDecrypt, decryptedText, 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo descifrado:', err);
                    return;
                }
                
                console.log(`Archivo descifrado '${outputFileDecrypt}' guardado correctamente.`);
            });
        });
    });
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

fs.readFile("C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/inputs/input(1).csv", 'utf8' , async (err, data) => {
  await sleep(30000);
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  const lines = data.split('\n');
  const bTree = new BTree(4); 
  for (const line of lines) {
    const [action, data] = line.split(';');
    if (action && data) {
      if(action == "INSERT"){
          var value = JSON.parse(data);                        
          value["companies"] = value["companies"].map((C) =>
            {
              let input_insert = value["dpi"] + C;
              return bTree.compressLZ78(input_insert);
            });
          let kvp = new KeyValuePair(value["dpi"], value);
          console.log("Datos ingresado 😎");
          bTree.insert(kvp);
        }else if(action == "PATCH"){
          var value = JSON.parse(data);
          value["companies"] = value["companies"].map((C) =>
            {
              let input_patch = value["dpi"] + C;
              return bTree.compressLZ78(input_patch);
            });
         bTree.patch(value["dpi"], value);
         console.log("Datos actualizado 👌");
        }else if(action == "DELETE"){
          var value = JSON.parse(data);
          console.log("Datos eliminado ☠️");
          bTree.delete(value["dpi"]);
        }
      }
  }
  console.log("1. Buscar persona por DPI cifrado");
  console.log("2. Buscar persona por DPI Descifrado");
  console.log("3. Validar firmas");
  console.log("4. Exit");
  var salida;
do {

  const choice = prompt('Ingrese una opción: ');
  switch (choice) {
    case "1":
      //Hace la busqueda del DPI
      var DPI = prompt('Ingrese el DPI de la persona que desea buscar: ');
      bTree.search_encryption(DPI);
      //Busca las cartas de la persona
      fs.readdir(encryptFolder, (err, files) => {
        let count = 1;
        files.forEach((file) => {
          var dpi_file = file.split("-")[1];
          if(dpi_file == DPI){
            let outputFileEncrypt_DPI = path.join(encryptFolder, file);
            fs.readFile(outputFileEncrypt_DPI, 'utf8', (err, data) => {
              if (err) {
                console.error('Error al leer el archivo de entrada:', err);
                return;
              }
              console.log("Conversaciónes " + count);
              console.log(data);
              console.log()
              count++;
            })
          }
        })
      })
      await sleep(3000); 
                

      break;
      case "2":
        var code = prompt('Ingrese contraseña: ')
        if(code == 1010010011)
        {
          //Hace la busqueda del DPI
          var DPI = prompt('Ingrese el DPI de la persona que desea buscar: ');
          bTree.search_encryption(DPI);
          //Busca las cartas de la persona
          fs.readdir(decryptFolder, (err, files) => {
            let count = 1;
            files.forEach((file) => {
              var dpi_file = file.split("-")[1];
              debugger
              if(dpi_file == DPI){
                let outputFileDecrypt_DPI = path.join(decryptFolder, file);
                fs.readFile(outputFileDecrypt_DPI, 'utf8', (err, data) => {
                  if (err) {
                    console.error('Error al leer el archivo de entrada:', err);
                    return;
                  }
                  console.log("Conversaciónes " + count);
                  console.log(data);
                  console.log()
                  count++;
                })
              }
            })
          })
          await sleep(3000);   
        }
      break;
      case "3":
        //Validar firmas
        const Validar = require('../Firma/Validar.js')
        break;
        case "4":
          console.log("¡Hasta luego!");
          break;
          default:
            console.log("Opción inválida");
            break;
        }
    salida = choice; 
  }while(salida != "4");
});


