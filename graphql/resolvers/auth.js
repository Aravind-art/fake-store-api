const { GraphQLError } = require("graphql");
const { verifyUser } = require("../../service/auth");

module.exports.login = async (_, args) => {
  const username = args.username;
  const password = args.password;
  if (username && password) {
    return await verifyUser({ username, password }).catch((err) => {
      console.error(err);
      throw new GraphQLError(err.error, {
        extensions: { code: "UNAUTHORIZED", http: { status: err.errorCode } },
      });
    });
  }
};
