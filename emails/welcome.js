function welcomeEmail(to) {
  return {
    from: '"ZAPOMINALKA" <zapominalka.app@gmail.com>',
    to,
    subject: "Welcome to zapominalka application!",
    text: "Wish you success in learning new words!",
    html: `
      <h1>Welcome</h1>
      <p>Wish you success in learning new words!</p>
    `
  };
};


module.exports = welcomeEmail;
