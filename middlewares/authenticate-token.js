const jwt = require("jsonwebtoken");


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === 'null') {
    return res.status(401).json('Authorization token not found!');
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, profile) => {
    console.log(err);

    if (err) {
      return res.status(401).json('Authorization has been expired!');
    }

    req.profileEmail = profile.email;
    next();
  });
}


module.exports = authenticateToken;
