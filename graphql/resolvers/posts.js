const Post = require("../../models/Post");

module.exports = {
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
