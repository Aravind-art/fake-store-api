const User = require("../model/user");
const jwt = require("jsonwebtoken");

module.exports.verifyUser = ({ username, password }) => {
  return User.findOne({
    username: username,
    password: password,
  }).then((user) => {
    if (user) {
      return {
        token: jwt.sign({ user: username, _id: user._id }, "secret_key"),
      };
    } else {
      throw { errorCode: 401, error: "username or password is incorrect" };
    }
  });
};
