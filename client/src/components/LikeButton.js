import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";

const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
  const [liked, setLiked] = useState(false);

  //1st determine whether we've liked it or not
  //so, with this check,liked only happend if in DB also we succefully liked,here we don't update UI only, Like UI only updates if in DB we successfully updated
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      //means we've liked the post

      setLiked(true);
    } else {
      //means we've not liked the post
      setLiked(false);
    }
  }, [user, likes]);

  //liked or unliked a post, trigger home component to re render due to auto update in Apollo's cache, so along with home compononent all of its child means all the post will re render. but the useEffect callback fun only runs for that post. not all post. because after liked or unliked only that specific post's like array is changed, not all post like array is changed so their dependency array remain same for useEffect()

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="blue">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="blue" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="blue" basic>
      <Icon name="heart" />
    </Button>
  );

  // * onClick={likePost} in this below button should be revisited coz it can cause minor bug

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}

      <Label basic color="blue" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
