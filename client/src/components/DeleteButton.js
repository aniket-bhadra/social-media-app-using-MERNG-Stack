import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        // Update the cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        });
      }

      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  const buttonStyle = {
    backgroundColor: isHovered ? "#ff4d4f" : "transparent",
    color: isHovered ? "white" : "#ff4d4f",
    border: `1px solid ${isHovered ? "#ff4d4f" : "#ff4d4f"}`,
    borderRadius: "50%",
    width: commentId ? "32px" : "38px",
    height: commentId ? "32px" : "38px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: isHovered ? "0 2px 6px rgba(255, 77, 79, 0.3)" : "none",
    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
  };

  const iconStyle = {
    margin: "0",
    fontSize: commentId ? "14px" : "16px",
  };

  const confirmStyle = {
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          floated="right"
          onClick={() => setConfirmOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={buttonStyle}
          className="delete-button"
        >
          <Icon name="trash alternate outline" style={iconStyle} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
        header={commentId ? "Delete Comment" : "Delete Post"}
        content={
          commentId
            ? "Are you sure you want to delete this comment? This action cannot be undone."
            : "Are you sure you want to delete this post? This action cannot be undone."
        }
        confirmButton={
          <Button
            negative
            style={{
              background: "#ff4d4f",
              color: "white",
              borderRadius: "6px",
              padding: "0.7em 1em",
              fontWeight: "600",
              boxShadow: "0 2px 6px rgba(255, 77, 79, 0.3)",
            }}
          >
            Delete
          </Button>
        }
        cancelButton={
          <Button
            style={{
              background: "#f0f2f5",
              color: "#2D3748",
              borderRadius: "6px",
              padding: "0.7em 1em",
              fontWeight: "600",
            }}
          >
            Cancel
          </Button>
        }
        style={confirmStyle}
      />
      <style jsx global>{`
        .delete-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }

        @media (max-width: 768px) {
          .delete-button {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
