const bcrypt = require('bcryptjs');


class PasswordEncryption {
  static async encryptAsync(password) {
    return await bcrypt.hash(password.trim(), 10)
  }

  static async compareAsync(password, encryptedPassword) {
    return await bcrypt.compare(password, encryptedPassword);
  }
}

module.exports = PasswordEncryption;
