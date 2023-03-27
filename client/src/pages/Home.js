import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

const Home = () => {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (data) {
    console.log(data.getPosts);
  }

  return (
    <div>
      <h1>home</h1>
    </div>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
