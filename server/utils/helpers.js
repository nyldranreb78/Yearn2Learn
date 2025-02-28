const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(raw, hash) {
  return await bcrypt.compare(raw, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
