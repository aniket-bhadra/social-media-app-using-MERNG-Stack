const postsResolvers = require("./posts");
const usersResolvers = require("./users");

//now combine both of these
module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
