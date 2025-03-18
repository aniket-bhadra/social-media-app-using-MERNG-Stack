import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";
import getAnonymousUsername from "../config/anonymity";

// Enhanced color theme
const colors = {
  background: "#F5F8FC",
  primary: "#0D2B4B",
  secondary: "#FF7A45",
  border: "#EDF2F7",
  cardBg: "#FFFFFF",
  lightText: "#6E7F91",
  darkText: "#2D3748",
};

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
        borderRadius: "16px",
        overflow: "hidden",
        border: "none",
        width: "100%", // Ensuring full width within its container
        marginBottom: "1.5rem",
        background: colors.cardBg,
        transform: "translateY(0)",
        height: "300px", // Setting a fixed height for the card
        display: "flex",
        flexDirection: "column",
      }}
      className="post-card"
    >
      <Card.Content style={{ padding: "1.5rem", flex: "0 0 auto" }}>
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
              width: "48px",
              height: "48px",
              objectFit: "cover",
              border: `2px solid ${colors.primary}`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <div style={{ marginLeft: "12px", flexGrow: 1 }}>
            <Card.Header
              style={{
                color: colors.primary,
                fontSize: "1.2rem",
                fontWeight: "600",
                margin: "0",
              }}
            >
              {DisplayedUsername ? DisplayedUsername : "Anonymous"}
            </Card.Header>
            <Card.Meta
              as={Link}
              to={`/posts/${id}`}
              style={{
                color: colors.lightText,
                fontSize: "0.85rem",
                margin: "0",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Icon name="clock outline" size="small" />
              {moment(createdAt).fromNow()}
            </Card.Meta>
          </div>
        </div>
      </Card.Content>

      <Card.Content
        style={{
          padding: "0 1.5rem",
          flex: "1 1 auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card.Description
          style={{
            color: colors.darkText,
            fontSize: "1rem",
            lineHeight: "1.6",
            wordWrap: "break-word",
            overflow: "auto", // Add scrollbar if content is too long
            height: "100%", // Take available space
            padding: "0.25rem 0.25rem 0.5rem 0",
            marginBottom: "0.5rem",
            // Custom scrollbar styling
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.lightText} transparent`,
          }}
          className="post-content"
        >
          {body}
        </Card.Description>
      </Card.Content>

      <Card.Content
        extra
        style={{
          background: colors.background,
          padding: "1rem 1.5rem",
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flex: "1 1 auto",
          }}
        >
          <div className="social-button" style={{ position: "relative" }}>
            <LikeButton
              user={user}
              post={{ id, likes, likeCount, body, username, createdAt }}
            />
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
      <style>{`
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
        
        /* Custom scrollbar for webkit browsers */
        .post-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .post-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .post-content::-webkit-scrollbar-thumb {
          background-color: ${colors.lightText};
          border-radius: 20px;
        }
        
        /* Hover effect for the card */
        .post-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.06);
        }
      `}</style>
    </Card>
  );
};

export default PostCard;
