const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

//now combine both of these
module.exports = {
  Post: {
    likeCount(parent) {
      console.log("not modified value of parent: ", parent);
      return parent.likes.length;
    },
    commentCount: (parent) => parent.comments.length,
  },

  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
