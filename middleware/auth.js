const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { GraphQLError } = require("graphql");

module.exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");
    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });
    // If user not found, throw error
    if (!user) {
      throw "No user found";
    }
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: new Error({ error: "No user found" }) });
  }
};

module.exports.authMiddleWareGql = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    next();
    return;
  }
  const decoded = jwt.verify(token, "secret_key");
  req.userData = decoded;
  next();
};

module.exports.authenticateGraphql = async (decoded) => {
  const user = await User.findOne({
    _id: decoded._id,
    // "tokens.token": token,
  });
  // If user not found, throw error
  if (!user) {
    throw new GraphQLError("Product Not Found", {
      extensions: { code: "ITEM_NOT_FOUND" },
    });
  }
};
