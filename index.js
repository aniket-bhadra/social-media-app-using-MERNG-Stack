const { ApolloServer } = require("apollo-server");
//here  now we need to have something called type definitions
//step1
//importing one of the dependencies of apollo server
const gql = require("graphql-tag");

const mongoose = require("mongoose");


const Post = require("./models/Post");
const { MONGODB } = require("./config.js");

//step2
//here write your grpahql types
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;
//so we've query-- getPosts. now create a resolver for this

//resolvers--
const resolvers = {
  Query: {
    async getPosts() {
      //it better to wrap in try catch, coz- if your query fails, it might stops your actual server, so that's why handle the catch separtly


     

      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
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
