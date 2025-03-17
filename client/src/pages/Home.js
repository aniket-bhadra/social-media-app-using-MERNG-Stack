import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Container, Grid, Loader, Card, Image } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  // Dummy recent posts data
  const dummyRecentPosts = [
    {
      id: "dummy1",
      body: "This is my first post on this platform. Really excited to share my thoughts!",
      createdAt: "2023-09-10T15:30:00.000Z",
    },
    {
      id: "dummy2",
      body: "Just finished reading an amazing book. Would highly recommend it to everyone!",
      createdAt: "2023-09-08T12:45:00.000Z",
    },
    
  ];

  return (
    <Container>
      <Grid stackable>
        <Grid.Row>
          {/* Left column - PostForm and Recent Posts box (only on desktop) */}
          <Grid.Column width={6} only="computer tablet">
            {user && (
              <div style={{ marginBottom: "2rem" }}>
                <PostForm />
              </div>
            )}

            {user && (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid #e1e8ed",
                  }}
                >
                  <h3
                    style={{ color: "#0D2B4B", margin: 0, fontWeight: "bold" }}
                  >
                    Your Recent Posts
                  </h3>
                </div>

                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    padding: "0.5rem",
                  }}
                >
                  {dummyRecentPosts.map((post) => (
                    <Card
                      fluid
                      key={post.id}
                      style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        marginBottom: "0.75rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Card.Content>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <Image
                            circular
                            src="https://react.semantic-ui.com/images/avatar/small/matt.jpg"
                            style={{ width: "30px", height: "30px" }}
                          />
                          <div style={{ marginLeft: "0.5rem" }}>
                            <Card.Meta
                              style={{
                                margin: 0,
                                color: "#6E7F91",
                                fontSize: "0.8rem",
                              }}
                            >
                              {moment(post.createdAt).fromNow()}
                            </Card.Meta>
                          </div>
                        </div>
                        <Card.Description style={{ fontSize: "0.9rem" }}>
                          {post.body.length > 100
                            ? `${post.body.substring(0, 100)}...`
                            : post.body}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Grid.Column>

          {/* Right column - All posts */}
          <Grid.Column
            width={user ? 10 : 16}
            computer={user ? 10 : 16}
            tablet={user ? 10 : 16}
            mobile={16}
          >
            {/* PostForm for mobile */}
            {user && (
              <div
                className="mobile-only"
                style={{ marginBottom: "2rem", display: "none" }}
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
                {data &&
                  data.getPosts.map((post) => (
                    <Grid.Column key={post.id} style={{ padding: "1rem" }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))}
              </Grid>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <style jsx global>{`
        @media only screen and (max-width: 767px) {
          .mobile-only {
            display: block !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default Home;
