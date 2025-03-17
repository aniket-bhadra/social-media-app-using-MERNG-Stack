import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";

const LikeButton = ({ user, post: { id, likeCount, likes } }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button 
        color="red" 
        className="like-button-inner"
        style={{ 
          borderRadius: "50px",
          backgroundColor: "#FF3B30",
          color: "white",
          boxShadow: "0 2px 4px rgba(255,59,48,0.3)",
          border: "none",
          padding: "0.6em 0.8em",
          minWidth: "unset",
          margin: 0,
          transition: "all 0.2s ease"
        }}
      >
        <Icon name="heart" style={{ margin: 0 }} />
      </Button>
    ) : (
      <Button 
        color="red" 
        basic 
        className="like-button-inner"
        style={{ 
          borderRadius: "50px",
          borderColor: "#FF3B30",
          color: "#FF3B30 !important",
          boxShadow: "none",
          padding: "0.6em 0.8em",
          minWidth: "unset",
          margin: 0,
          transition: "all 0.2s ease"
        }}
      >
        <Icon name="heart" style={{ margin: 0 }} />
      </Button>
    )
  ) : (
    <Button 
      as={Link} 
      to="/login" 
      color="red" 
      basic
      className="like-button-inner"
      style={{ 
        borderRadius: "50px",
        borderColor: "#FF3B30",
        color: "#FF3B30 !important",
        boxShadow: "none",
        padding: "0.6em 0.8em",
        minWidth: "unset",
        margin: 0,
        transition: "all 0.2s ease"
      }}
    >
      <Icon name="heart" style={{ margin: 0 }} />
    </Button>
  );

  return (
    <Button 
      as="div" 
      labelPosition="right" 
      onClick={likePost}
      className="like-button"
      style={{ 
        background: "transparent", 
        margin: 0,
        padding: 0,
        border: "none",
        boxShadow: "none",
        display: "flex",
        alignItems: "center"
      }}
    >
      <MyPopup content={liked ? "Unlike" : "Like"}>
        {likeButton}
      </MyPopup>

      <Label 
        basic 
        style={{ 
          borderRadius: "50px",
          marginLeft: "0.35rem !important",
          borderColor: "#FF3B30",
          color: "#FF3B30 !important", 
          background: "transparent",
          fontWeight: "normal",
          fontSize: "0.9rem",
          padding: "0.5em 0.8em",
          boxShadow: "none"
        }} 
        pointing="left"
      >
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