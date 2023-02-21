const { ApolloServer } = require("apollo-server");
//here  now we need to have something called type definitions
//step1
//importing one of the dependencies of apollo server
const gql = require("graphql-tag");

const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");

//step2
//here write your grpahql types
//
const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

//resolvers
const resolvers = {
  Query: {
    sayHi: () => "Hello World!!!!!!",
  },
};

//setup the apollo sever
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//server instance is created, now start the server, when DB is connected

mongoose
  .connect(MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server is listening at ${res.url}`);
  });
