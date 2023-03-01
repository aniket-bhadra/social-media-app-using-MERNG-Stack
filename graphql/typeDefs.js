const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    
  }
`;

//input ---this not the type. this is an input which is diff type of type which is given as input to resolver for it to return something for us
//register(registerInput: RegisterInput)--this needs to return something

// type User{
//   id: ID!
//   email: String!
// }
//even if we specify required it doesn't mean that the user has to get these. actually that means we have to return them from our Resolver but the user can still opt out from not getting these

//so whatever we r setting here weather it is input type or returrn type------it is for our resolver.
