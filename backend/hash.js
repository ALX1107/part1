// hash.js
const bcrypt = require('bcryptjs');

(async () => {
  const password = 'admin123';
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash de admin123:', hash);
})();
