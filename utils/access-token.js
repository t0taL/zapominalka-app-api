const jwt = require("jsonwebtoken");


class AccessToken {
  static generateToken(email) {
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '2592000000ms' }); // 30d
    return token;
  }

  static generateTokenForResetPassword(email) {
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '3600000ms' }); // 1h
    return token;
  }

  static getEmailFromToken(token) {
    const email = jwt.verify(token, process.env.TOKEN_SECRET).email;
    return email;
  }
}


module.exports = AccessToken; 
