const forge = require('node-forge');
const hash512 = (data) => {
  return forge.md.sha512.create().update(data).digest().toHex();
};
console.log(hash512('sdaasdsadddddd'));
console.log(hash512('sdaasdsadddddd').length);
console.log(hash512('The quick brown fox jumps over the lazy dog'));
console.log(hash512('The quick brown fox jumps over the lazy dog').length);
