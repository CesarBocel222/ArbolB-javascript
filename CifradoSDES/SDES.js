class SDES {
  constructor(key) {
    this.key1 = this.generateKey1(key);
    this.key2 = this.generateKey2(key);
  }

  encryptString(input) {
    const bits = this.convertStringToBits(input);
    const encryptedBlocks = [];

    for (let i = 0; i < bits.length; i += 8) {
      const block = bits.slice(i, i + 8);
      const encryptedBlock = this.encrypt(block);
      encryptedBlocks.push(encryptedBlock);
    }

    return encryptedBlocks;
  }

  decryptBlocks(encryptedBlocks) {
    const decryptedBlocks = [];

    for (const block of encryptedBlocks) {
      const decryptedBlock = this.decrypt(block);
      decryptedBlocks.push(decryptedBlock);
    }

    return this.convertBitsToString(decryptedBlocks);
  }

  convertBitsToString(blocks) {
    const chars = [];

    for (const block of blocks) {
      const bitString = block.join('');
      const b = parseInt(bitString, 2);
      const c = String.fromCharCode(b);
      chars.push(c);
    }

    return chars.join('');
  }

  convertStringToBits(input) {
    const bytes = new TextEncoder().encode(input);
    const bits = [];

    for (const byte of bytes) {
      for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }

    return bits;
  }

  encrypt(plaintext) {
    const permutedPlaintext = this.initialPermutation(plaintext);
    const afterFirstFK = this.functionFK(permutedPlaintext, this.key1);
    const afterSwap = this.swap(afterFirstFK);
    const afterSecondFK = this.functionFK(afterSwap, this.key2);
    const ciphertext = this.inverseInitialPermutation(afterSecondFK);

    return ciphertext;
  }

  decrypt(ciphertext) {
    const permutedCiphertext = this.initialPermutation(ciphertext);
    const afterFirstFK = this.functionFK(permutedCiphertext, this.key2);
    const afterSwap = this.swap(afterFirstFK);
    const afterSecondFK = this.functionFK(afterSwap, this.key1);
    const plaintext = this.inverseInitialPermutation(afterSecondFK);

    return plaintext;
  }

  generateKey1(key) {
    return this.permuteP10(key);
  }

  generateKey2(key) {
    return this.permuteP8(key);
  }

  swap(data) {
    const leftHalf = data.slice(0, data.length / 2);
    const rightHalf = data.slice(data.length / 2);

    return rightHalf.concat(leftHalf);
  }

  permute(input, pattern) {
    const output = [];

    for (const index of pattern) {
      output.push(input[index]);
    }

    return output;
  }

  initialPermutation(input) {
    const pattern = [1, 5, 2, 0, 3, 7, 4, 6];
    return this.permute(input, pattern);
  }

  inverseInitialPermutation(input) {
    const pattern = [3, 0, 2, 4, 6, 1, 7, 5];
    return this.permute(input, pattern);
  }

  permuteP10(key) {
    const pattern = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];
    return this.permute(key, pattern);
  }

  permuteP8(key) {
    const pattern = [5, 2, 6, 3, 7, 4, 9, 8];
    return this.permute(key, pattern);
  }

  permuteP4(input) {
    const pattern = [1, 3, 2, 0];
    return this.permute(input, pattern);
  }

  expandPermute(input) {
    const pattern = [3, 0, 1, 2, 1, 2, 3, 0];
    return this.permute(input, pattern);
  }

  functionFK(data, key) {
    const leftHalf = data.slice(0, data.length / 2);
    const rightHalf = data.slice(data.length / 2);
    const expandedRightHalf = this.expandPermute(rightHalf);
    const afterXOR = this.xor(expandedRightHalf, key);
    const afterSubstitution = this.substitute(afterXOR);
    const afterP4 = this.permuteP4(afterSubstitution);
    const result = this.xor(leftHalf, afterP4);

    return result.concat(rightHalf);
  }

  xor(input1, input2) {
    const result = [];

    for (let i = 0; i < input1.length; i++) {
      result.push(input1[i] ^ input2[i]);
    }

    return result;
  }

  substitute(input) {
    const sBox0 = [
      [1, 0, 3, 2],
      [3, 2, 1, 0],
      [0, 2, 1, 3],
      [3, 1, 3, 2]
    ];

    const sBox1 = [
      [0, 1, 2, 3],
      [2, 0, 1, 3],
      [3, 0, 1, 0],
      [2, 1, 0, 3]
    ];

    const leftHalf = input.slice(0, input.length / 2);
    const rightHalf = input.slice(input.length / 2);
    const afterSubstitutionLeft = this.substituteWithSBox(leftHalf, sBox0);
    const afterSubstitutionRight = this.substituteWithSBox(rightHalf, sBox1);

    return afterSubstitutionLeft.concat(afterSubstitutionRight);
  }

  substituteWithSBox(input, sBox) {
    const row = parseInt(input[0].toString() + input[3].toString(), 2);
    const column = parseInt(input[1].toString() + input[2].toString(), 2);
    const value = sBox[row][column];

    return value.toString(2).padStart(2, '0').split('').map(Number);
  }

}
module.exports = SDES;