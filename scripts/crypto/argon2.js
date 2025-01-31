const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
// Cấu hình tập trung chống brute force
const bruteForceConfig = {
  type: argon2.argon2id,
  memoryCost: 2 ** 11,
  timeCost: 10,
  parallelism: 2,
  hashLength: 32,
  secret: Buffer.from('mysecret'),
  associatedData: Buffer.from(`${uuidv4()}`),
};
// Hàm băm mật khẩu
async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password, bruteForceConfig);
    console.log('Hashed Password:', hash);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}
// Kiểm tra mật khẩu
async function verifyPassword(hash, password) {
  try {
    const isMatch = await argon2.verify(hash, password, { secret: Buffer.from('mysecret') });
    console.log(isMatch ? 'Password is correct!' : 'Password is incorrect!');
  } catch (err) {
    console.error('Error verifying password:', err);
  }
}
// Chạy thử
(async () => {
  const password = 'BruteForce@1234';
  const hash = await hashPassword(password);
  await verifyPassword(hash, password); // Kiểm tra đúng
  await verifyPassword(hash, 'WrongPassword'); // Kiểm tra sai
})();
