import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";
import getAnonymousUsername from "../config/anonymity";

const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext);
  const [DisplayedUsername, setDisplayedUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const { anonymousUsername, avatar } = getAnonymousUsername(username);
    setDisplayedUsername(anonymousUsername);
    setAvatar(avatar);
  }, [username]);

  return (
    <Card
      fluid
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)",
        transition: "all 0.25s ease",
        borderRadius: "12px",
        overflow: "hidden",
        border: "none",
        maxWidth: "100%",
        marginBottom: "1rem",
        background: "#fff",
        transform: "translateY(0)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.06)",
        },
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
              width: "45px",
              height: "45px",
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
              {DisplayedUsername ? DisplayedUsername : "Anonymous"}
            </Card.Header>
            <Card.Meta
              as={Link}
              to={`/posts/${id}`}
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
              <Button
                labelPosition="right"
                as={Link}
                to={`/posts/${id}`}
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
              </Button>
            </MyPopup>
          </div>
        </div>

        {user && user.username === username && (
          <div style={{ marginLeft: "auto" }}>
            <DeleteButton postId={id} />
          </div>
        )}
      </Card.Content>
      <style jsx global>{`
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
    </Card>
  );
};

export default PostCard;
