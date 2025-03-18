import React, { useContext, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Container,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";
import getAnonymousUsername from "../config/anonymity";

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");
  const [displayedUsername, setDisplayedUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePostCallback = () => {
    navigate("/", {
      replace: true,
    });
  };

  useEffect(() => {
    if (data && data.getPost) {
      const { anonymousUsername, avatar } = getAnonymousUsername(
        data.getPost.username
      );
      setDisplayedUsername(anonymousUsername);
      setAvatar(avatar);
    }
  }, [data]);

  let postMarkup;
  if (!data) {
    postMarkup = (
      <Container text style={{ padding: "2rem 0" }}>
        <div
          className="loading-container"
          style={{ textAlign: "center", padding: "3rem 0" }}
        >
          <Icon
            loading
            name="spinner"
            size="big"
            style={{ color: "#0D2B4B" }}
          />
          <p style={{ marginTop: "1rem", color: "#0D2B4B" }}>Loading post...</p>
        </div>
      </Container>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    postMarkup = (
      <Container style={{ padding: "2rem 0" }}>
        <Card
          fluid
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "none",
            maxWidth: "100%",
            marginBottom: "1rem",
            background: "#fff",
          }}
        >
          <Card.Content style={{ padding: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <Image
                circular
                src={avatar ? avatar : ""}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  border: "2px solid #0D2B4B",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <div style={{ marginLeft: "12px", flexGrow: 1 }}>
                <Card.Header
                  style={{
                    color: "#0D2B4B",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0",
                  }}
                >
                  {displayedUsername ? displayedUsername : "Anonymous"}
                </Card.Header>
                <Card.Meta
                  style={{ color: "#6E7F91", fontSize: "0.8rem", margin: "0" }}
                >
                  {moment(createdAt).fromNow()}
                </Card.Meta>
              </div>
            </div>
            <Card.Description
              style={{
                color: "#2D3748",
                fontSize: "1rem",
                lineHeight: "1.5",
                marginBottom: "1rem",
                wordWrap: "break-word",
                padding: "0.5rem 0",
              }}
            >
              {body}
            </Card.Description>
          </Card.Content>
          <Card.Content
            extra
            style={{
              background: "#F8FAFC",
              padding: "0.75rem 1.25rem",
              borderTop: "1px solid #EDF2F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flex: "1 1 auto",
              }}
            >
              <div className="social-button" style={{ position: "relative" }}>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
              </div>

              <div className="social-button">
                <MyPopup content="Comment on post">
                  <div
                    labelPosition="right"
                    onClick={() => commentInputRef.current.focus()}
                    style={{
                      background: "transparent",
                      margin: 0,
                      padding: 0,
                      border: "none",
                      boxShadow: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="purple"
                      basic
                      style={{
                        borderRadius: "50px",
                        borderColor: "#5E35B1",
                        color: "#5E35B1 !important",
                        boxShadow: "none",
                        minWidth: "unset",
                        padding: "0.6em 0.8em",
                        margin: 0,
                        transition: "all 0.2s ease",
                      }}
                      className="comment-button"
                    >
                      <Icon name="comments" />
                    </Button>
                    <Label
                      basic
                      style={{
                        borderRadius: "50px",
                        marginLeft: "0.35rem !important",
                        borderColor: "#5E35B1",
                        color: "#5E35B1 !important",
                        background: "transparent",
                        fontWeight: "normal",
                        fontSize: "0.9rem",
                        padding: "0.5em 0.8em",
                        boxShadow: "none",
                      }}
                      pointing="left"
                    >
                      {commentCount}
                    </Label>
                  </div>
                </MyPopup>
              </div>
            </div>

            {user && user.username === username && (
              <div style={{ marginLeft: "auto" }}>
                <DeleteButton postId={id} callback={deletePostCallback} />
              </div>
            )}
          </Card.Content>
        </Card>

        {user && (
          <Card
            fluid
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)",
              borderRadius: "12px",
              overflow: "hidden",
              border: "none",
              maxWidth: "100%",
              marginBottom: "1rem",
              background: "#fff",
            }}
          >
            <Card.Content style={{ padding: "1.25rem" }}>
              <h3
                style={{
                  color: "#0D2B4B",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                Post a comment
              </h3>
              <Form>
                <div
                  className="ui action input fluid"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <input
                    type="text"
                    placeholder="Got something to say? Leave a comment!"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    ref={commentInputRef}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "8px 0 0 8px",
                      border: "1px solid #E2E8F0",
                    }}
                  />
                  <button
                    type="submit"
                    className="ui button"
                    disabled={comment.trim() === ""}
                    onClick={submitComment}
                    style={{
                      background: "#5E35B1",
                      color: "white",
                      borderRadius: "0 8px 8px 0",
                      padding: "0.8rem 1.2rem",
                      fontWeight: "600",
                      border: "none",
                      cursor: comment.trim() === "" ? "not-allowed" : "pointer",
                      opacity: comment.trim() === "" ? "0.6" : "1",
                    }}
                  >
                    Comment
                  </button>
                </div>
              </Form>
            </Card.Content>
          </Card>
        )}

        {comments.length > 0 && (
          <div className="comments-section">
            <h3
              style={{
                color: "#0D2B4B",
                fontSize: "1.1rem",
                fontWeight: "600",
                margin: "1.5rem 0 1rem",
              }}
            >
              Comments ({comments.length})
            </h3>
            {comments.map((comment) => {
              const { anonymousUsername, avatar } = getAnonymousUsername(
                comment.username
              );
              return (
                <Card
                  fluid
                  key={comment.id}
                  style={{
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "none",
                    maxWidth: "100%",
                    marginBottom: "1rem",
                    background: "#fff",
                  }}
                >
                  <Card.Content style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <Image
                        circular
                        src={avatar ? avatar : ""}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          border: "2px solid #0D2B4B",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <div style={{ marginLeft: "12px", flexGrow: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Card.Header
                              style={{
                                color: "#0D2B4B",
                                fontSize: "1rem",
                                fontWeight: "600",
                                margin: "0",
                              }}
                            >
                              {anonymousUsername}
                            </Card.Header>
                            <Card.Meta
                              style={{
                                color: "#6E7F91",
                                fontSize: "0.8rem",
                                margin: "0",
                              }}
                            >
                              {moment(comment.createdAt).fromNow()}
                            </Card.Meta>
                          </div>
                          {user && user.username === comment.username && (
                            <DeleteButton postId={id} commentId={comment.id} />
                          )}
                        </div>
                        <Card.Description
                          style={{
                            color: "#2D3748",
                            fontSize: "0.95rem",
                            lineHeight: "1.5",
                            marginTop: "0.5rem",
                            wordWrap: "break-word",
                          }}
                        >
                          {comment.body}
                        </Card.Description>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    );
  }

  return (
    <>
      {postMarkup}
      <style jsx="true" global="true">{`
        @media (max-width: 768px) {
          .social-button {
            flex: 1 1 auto;
          }
          .comment-button,
          .like-button {
            width: 100%;
            justify-content: center;
          }
        }
        .like-button:hover,
        .comment-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
      `}</style>
    </>
  );
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
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

export default SinglePost;
