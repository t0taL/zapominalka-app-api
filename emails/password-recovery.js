function passwordRecovery(to, token) {
  return {
    from: '"ZAPOMINALKA" <zapominalka.app@gmail.com>',
    to,
    subject: "Password recovery",
    html: `
      <h1>Password recovery</h1>
      <p>Have you requested password recovery?</p>
      <p>If not, then ignore this message!</p>
      <hr/>
      <p>This is the link for password recovery: <a href="${process.env.CLIENT_URL_ADDRESS}${token}">click here!</a></p>
    `
  };
};


module.exports = passwordRecovery;
