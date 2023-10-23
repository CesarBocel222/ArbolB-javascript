const fs = require('fs');
const crypto = require('crypto');

const inputDir = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/inputs/inputs';
const outputDir = 'C:/Users/50255/Desktop/URL/Sexto ciclo/Estructura 2/Lab/Lab1/Firmas';
// Generar par de claves RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
       type: 'spki',
       format: 'pem',
    },
    privateKeyEncoding: {
       type: 'pkcs8',
       format: 'pem',
    },
});


const sign = (input, privateKey) => {
 const signer = crypto.createSign('RSA-SHA256');
 signer.update(input);
 return signer.sign(privateKey, 'hex');
};

const verify = (input, signature, publicKey) => {
 const verifier = crypto.createVerify('RSA-SHA256');
 verifier.update(input);
 return verifier.verify(publicKey, signature, 'hex');
};

fs.readdir(inputDir, (err, files) => {
 if (err) {
    console.error('Error reading directory:', err);
    return;
 }

 files.forEach(file => {
    if (file.endsWith('.txt')) {
      const inputPath = `${inputDir}/${file}`;
      const outputPath = `${outputDir}/${file}.signed`;

      fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }

        const signature = sign(data, privateKey);

        fs.writeFile(outputPath, JSON.stringify({
          content: data,
          signature: signature
        }), err => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }

          console.log(`Archivo ${file} firmado y escrito a ${outputPath}`);
          console.log(`Archivo firmado: ${file}, Firma: ${signature}`);
          const verified = verify(data, signature, publicKey);
          console.log(`Resultado de la verificación de firma para el archivo ${file}:`, verified);
          console.log("");
        });
      });
    }
 });
});
