const { verifyUser } = require("../service/auth");

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    verifyUser({ username, password })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ error: err.error });
      });
  }
};
