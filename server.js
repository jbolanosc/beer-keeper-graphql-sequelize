const express = require("express");
const jwt = require("express-jwt");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./resolvers/resolvers");
const JWT_SECRET = require("./constants");

const PORT = 7100;
const HOST = "0.0.0.0";

const app = express();
const auth = jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
});

app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: "graphql",
  },
  context: ({ req }) => {
    const user = req.headers.user
      ? JSON.parse(req.headers.user)
      : req.user
      ? req.user
      : null;
    return { user };
  },
});

server.applyMiddleware({ app });

app.listen(PORT, HOST);
console.log(`Running in port: ${PORT} and host: ${HOST}`);
