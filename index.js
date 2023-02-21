const { ApolloServer } = require("apollo-server");
//here  now we need to have something called type definitions
//step1
//importing one of the dependencies of apollo server
const gql = require("graphql-tag");

//step2
//here write your grpahql types
//
const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;


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


//server instance is created, now start the server

server.listen({ port: 5000 }).then((res) => {
  console.log(`Server is listening at ${res.url}`);
});
