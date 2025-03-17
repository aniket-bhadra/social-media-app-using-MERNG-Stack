import React, { useContext, useRef, useState } from "react";
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

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post...</p>;
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
    const { anonymousUsername, avatar } = getAnonymousUsername(username);

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src={avatar ? avatar : ""} size="small" float="right" />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{anonymousUsername}</Card.Header>
                <Card.Meta> {moment(createdAt).fromNow()} </Card.Meta>
                <Card.Description> {body} </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => commentInputRef.current.focus()}
                  >
                    <Button basic color="purple">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="purple" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>

            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Got something to say? Leave a comment!"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button purple"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
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
