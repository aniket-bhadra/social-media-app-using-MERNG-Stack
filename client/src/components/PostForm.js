import React from "react";
import { Button, Form, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });

      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      }}
    >
      <h2
        style={{ color: "#0D2B4B", marginBottom: "1rem", fontWeight: "bold" }}
      >
        Share your thoughts
      </h2>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <div style={{ position: "relative" }}>
            <Form.TextArea
              placeholder="What's on your mind?"
              name="body"
              onChange={onChange}
              value={values.body}
              error={error ? true : false}
              style={{
                borderRadius: "8px",
                border: "1px solid #e1e8ed",
                padding: "12px 15px",
                minHeight: "80px",
                resize: "vertical",
                marginBottom: "10px",
                fontSize: "1rem",
              }}
            />
            <Button
              type="submit"
              disabled={values.body.trim() === ""}
              style={{
                background: "#FF7A45",
                color: "white",
                borderRadius: "30px",
                padding: "10px 20px",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.3s",
                float: "right",
              }}
              className="post-button"
            >
              <Icon name="paper plane" style={{ marginRight: "5px" }} />
              Post
            </Button>
            <div style={{ clear: "both" }}></div>
          </div>
        </Form.Field>
      </Form>

      {error && (
        <div
          className="ui error message"
          style={{
            marginTop: "1rem",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #e0b4b4",
          }}
        >
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}

      <style >{`
        .post-button:hover {
          background-color: #e56935 !important;
        }
      `}</style>
    </div>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
