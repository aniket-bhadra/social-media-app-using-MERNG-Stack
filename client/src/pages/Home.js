import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Container, Grid, Loader, Card, Icon } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
  // Destructure context with default values
  const contextValue = useContext(AuthContext);
  const user = contextValue?.user || null;
  // Explicitly ensure recentLike is an array
  const recentLike = Array.isArray(contextValue?.recentLike)
    ? contextValue.recentLike
    : [];

  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  // Function to safely render liked posts
  const renderLikedPosts = () => {
    if (!Array.isArray(recentLike) || recentLike.length === 0) {
      return (
        <div className="empty-likes-container">
          <Icon
            name="heart outline"
            size="huge"
            style={{ color: "#EDF2F7", margin: "1rem 0" }}
          />
          <p className="empty-likes-text">You haven't liked any posts yet.</p>
          <p style={{ fontSize: "0.9rem", color: "#6E7F91" }}>
            Posts you like will appear here for quick access.
          </p>
        </div>
      );
    }

    return recentLike
      .slice()
      .reverse()
      .map((likedPost) => {
        if (!likedPost || !likedPost.postId) return null;

        return (
          <Card fluid key={likedPost.postId} className="liked-post-card">
            <Card.Content>
              <div className="liked-post-header">
                <div className="liked-post-icon">
                  <Icon
                    name="user secret"
                    size="large"
                    style={{ color: "#0D2B4B" }}
                  />
                </div>
                <div className="liked-post-meta">
                  <Card.Header
                    style={{
                      fontSize: "0.95rem",
                      marginBottom: "0.2rem",
                      color: "#2D3748",
                    }}
                  >
                    Anonymous User
                  </Card.Header>
                  <Card.Meta className="liked-post-time">
                    <Icon name="clock outline" size="small" />
                    <span>{moment(likedPost.postCreatedAt).fromNow()}</span>
                  </Card.Meta>
                </div>
              </div>
              <Card.Description className="liked-post-body">
                {likedPost.postBody && typeof likedPost.postBody === "string"
                  ? likedPost.postBody.length > 100
                    ? `${likedPost.postBody.substring(0, 100)}...`
                    : likedPost.postBody
                  : ""}
              </Card.Description>
              <div className="liked-post-footer">
                <Icon name="heart" style={{ color: "#FF7A45" }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#6E7F91",
                    marginLeft: "0.3rem",
                  }}
                >
                  You liked this post
                </span>
              </div>
            </Card.Content>
          </Card>
        );
      });
  };

  return (
    <Container>
      <Grid stackable>
        <Grid.Row>
          {/* Left column - PostForm and Recent Posts box (only on desktop) */}
          <Grid.Column only="computer tablet" width={6}>
            {user && (
              <div style={{ marginBottom: "2rem", marginTop: "2.4rem" }}>
                <PostForm />
              </div>
            )}

            {user && (
              <div className="liked-posts-container">
                <div className="liked-posts-header">
                  <Icon
                    name="bookmark"
                    style={{ marginRight: "0.5rem", color: "#0D2B4B" }}
                  />
                  <h3>Your Recent Favorite Posts</h3>
                </div>

                <div className="liked-posts-content">{renderLikedPosts()}</div>
              </div>
            )}
          </Grid.Column>

          {/* Right column - All posts */}
          <Grid.Column
            computer={user ? 10 : 16}
            tablet={user ? 10 : 16}
            mobile={16}
          >
            {/* PostForm for mobile */}
            {user && (
              <div
                className="mobile-only"
                style={{
                  marginBottom: "2rem",
                  display: "none",
                  marginTop: "2.4rem",
                }}
              >
                <PostForm />
              </div>
            )}

            <div
              className="page-header"
              style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #e1e8ed",
                paddingBottom: "1rem",
              }}
            >
              <h1
                style={{
                  color: "#0D2B4B",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginTop: "2rem",
                }}
              >
                Recent Posts
              </h1>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Loader active inline="centered" size="large" />
                <p style={{ marginTop: "1rem", color: "#0D2B4B" }}>
                  Loading posts...
                </p>
              </div>
            ) : (
              <Grid columns={2} stackable style={{ margin: "0 -1rem" }}>
                {data && data.getPosts && Array.isArray(data.getPosts) ? (
                  data.getPosts.map((post) => (
                    <Grid.Column key={post.id} style={{ padding: "1rem" }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))
                ) : (
                  <p>No posts available</p>
                )}
              </Grid>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <style>{`
        @media only screen and (max-width: 767px) {
          .mobile-only {
            display: block !important;
          }
        }
        
        .liked-posts-container {
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 2rem;
          border: 1px solid #EDF2F7;
          overflow: hidden;
        }
        
        .liked-posts-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #EDF2F7;
          display: flex;
          align-items: center;
          background-color: #FFFFFF;
        }
        
        .liked-posts-header h3 {
          color: #0D2B4B;
          margin: 0;
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .liked-posts-content {
          max-height: 450px;
          overflow-y: auto;
          padding: 0.75rem;
          background-color: #F9FAFC;
        }
        
        .liked-post-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
          margin-bottom: 0.75rem !important;
          border-radius: 8px !important;
          border: 1px solid #EDF2F7 !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
        }
        
        .liked-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.05) !important;
        }
        
        .liked-post-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .liked-post-icon {
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .liked-post-meta {
          flex: 1;
        }
        
        .liked-post-time {
          display: flex;
          align-items: center;
          margin: 0 !important;
          color: #6E7F91 !important;
          font-size: 0.75rem !important;
        }
        
        .liked-post-time span {
          margin-left: 0.3rem;
        }
        
        .liked-post-body {
          font-size: 0.9rem !important;
          line-height: 1.5 !important;
          color: #2D3748 !important;
          margin-bottom: 0.75rem !important;
        }
        
        .liked-post-footer {
          border-top: 1px solid #EDF2F7;
          padding-top: 0.75rem;
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
        }
        
        .empty-likes-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
        }
        
        .empty-likes-text {
          margin: 0.5rem 0;
          color: #2D3748;
          font-weight: 500;
        }
      `}</style>
    </Container>
  );
};

export default Home;
