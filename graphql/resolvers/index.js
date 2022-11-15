const { login } = require("./auth");
const { productMutations, productQueries } = require("./product");

module.exports.queryResolver = {
  Query: {
    ...productQueries,
    login,
  },
  Mutation: {
    ...productMutations,
  },
};
