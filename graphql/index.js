const { ApolloServer } = require("@apollo/server");
const schema = require("./schema");

const apolloServer = new ApolloServer({
  schema,
  playground: process.env.NODE_ENV === "dev",
});

module.exports = apolloServer;
