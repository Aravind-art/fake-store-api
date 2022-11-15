const { join } = require("path");
const { readdirSync, readFileSync } = require("fs");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { queryResolver } = require("./resolvers");

const gqlFiles = readdirSync(join(__dirname, "./typedef"));

let typeDefs = "";

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(__dirname, "./typedef", file), {
    encoding: "utf8",
  });
});
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: queryResolver,
});

module.exports = schema;
