import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Menu,
  Icon,
  Dropdown,
  Modal,
  Button,
  Header,
  Grid,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import getAnonymousUsername from "../config/anonymity";

// Enhanced color theme
const colors = {
  background: "#F5F8FC",
  primary: "#0D2B4B",
  secondary: "#FF7A45",
  menuBackground: "#FFFFFF", // New professional menubar background
  accent: "#6366F1", // Additional accent color for highlighting
  border: "#E2E8F0",
};

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.slice(1);
  const [activeItem, setActiveItem] = useState(path);
  const [displayedUsername, setDisplayedUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user || !user.username) return;
    const { anonymousUsername, avatar } = getAnonymousUsername(user.username);
    setDisplayedUsername(anonymousUsername);
    setAvatar(avatar);
  }, [user]);

  // Logo component
  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          backgroundColor: colors.secondary,
          borderRadius: "12px",
          padding: "3px",
          marginRight: "12px",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(255,122,69,0.3)",
        }}
      >
        <Image
          src="/logo.png"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            margin: 0,
          }}
        />
      </div>
      {!isMobile && (
        <span
          style={{
            fontWeight: "bold",
            color: colors.primary,
            fontSize: "1.5rem",
            letterSpacing: "-0.5px",
          }}
        >
          Post<span style={{ color: colors.secondary }}>Wind</span>
        </span>
      )}
    </div>
  );

  // User Avatar component with enhanced styling
  const UserAvatar = () => (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: "50px",
        background: `linear-gradient(to right, ${colors.background}, white)`,
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        border: `1px solid ${colors.border}`,
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Image
        src={
          avatar ||
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
        }
        avatar
        style={{
          border: `2px solid ${colors.secondary}`,
          width: "32px",
          height: "32px",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          fontSize: "0.9rem",
          color: colors.primary,
          marginLeft: "8px",
          fontWeight: "500",
        }}
      >
        {displayedUsername || "Anonymous"}
        <Icon
          name="chevron down"
          size="small"
          style={{ marginLeft: "5px", opacity: 0.7 }}
        />
      </div>
    </div>
  );

  // Profile Modal component
  const ProfileModal = () => (
    <Modal
      open={profileModalOpen}
      onClose={() => setProfileModalOpen(false)}
      size="tiny"
      closeIcon
    >
      <Modal.Header
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          color: "white",
          borderBottom: "none",
          borderRadius: "0.28571429rem 0.28571429rem 0 0",
          padding: "1.5rem",
        }}
      >
        <Header as="h2" style={{ color: "white", margin: 0 }}>
          <Icon name="user circle" />
          <Header.Content>
            Your Profile
            <Header.Subheader
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
                marginTop: "5px",
              }}
            >
              Personal and anonymous details
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>

      <Modal.Content style={{ padding: "1.5rem" }}>
        <Grid stackable>
          <Grid.Column width={6} style={{ textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto",
                width: "120px",
                height: "120px",
                borderRadius: "60px",
                overflow: "hidden",
                border: `4px solid ${colors.secondary}`,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                marginBottom: "1rem",
              }}
            >
              <Image
                src={
                  avatar ||
                  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                }
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: colors.primary,
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              {displayedUsername || "Anonymous"}
            </div>
            <div
              style={{
                color: colors.secondary,
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              Anonymous Identity
            </div>
          </Grid.Column>

          <Grid.Column width={10}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  color: colors.primary,
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                <Icon name="id badge" /> Real Username
              </h4>
              <div
                style={{
                  background: colors.background,
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "1rem",
                }}
              >
                {user?.username || "Not available"}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  color: colors.primary,
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                <Icon name="mail" /> Email Address
              </h4>
              <div
                style={{
                  background: colors.background,
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "1rem",
                }}
              >
                {user?.email || "Not available"}
              </div>
            </div>

            <div>
              <h4
                style={{
                  color: colors.primary,
                  marginBottom: "0.5rem",
                  fontSize: "1rem",
                }}
              >
                <Icon name="user secret" /> Anonymous Username
              </h4>
              <div
                style={{
                  background: colors.background,
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.border}`,
                  fontSize: "1rem",
                }}
              >
                {displayedUsername || "Not available"}
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </Modal.Content>

      <Modal.Actions
        style={{
          background: "#F9FAFB",
          padding: "1rem 1.5rem",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <Button
          onClick={() => setProfileModalOpen(false)}
          style={{
            backgroundColor: colors.primary,
            color: "white",
            borderRadius: "6px",
            padding: "0.8em 1.5em",
            fontWeight: "500",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Icon name="check" /> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );

  // Mobile menu with enhanced styling
  const MobileMenu = () => (
    <Dropdown
      icon={<Icon name="bars" size="large" style={{ color: colors.primary }} />}
      className="mobile-dropdown"
    >
      <Dropdown.Menu>
        {user ? (
          <>
            <Dropdown.Item as={Link} to="/">
              <Icon name="home" color="blue" /> Home
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setProfileModalOpen(true)}>
              <Icon name="user" color="teal" /> Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>
              <Icon name="sign out" color="red" /> Logout
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item as={Link} to="/">
              <Icon name="home" color="blue" /> Home
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/login">
              <Icon name="sign in" color="green" /> Login
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/register">
              <Icon name="user plus" color="orange" /> Register
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  // Desktop menu - logged in user
  if (!isMobile && user) {
    return (
      <>
        <Menu
          secondary
          style={{
            backgroundColor: colors.menuBackground,
            borderBottom: `1px solid ${colors.border}`,
            margin: 0,
            padding: "0.5rem 1rem",
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Menu.Item as={Link} to="/">
            <Logo />
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Button
                  as={Link}
                  to="/"
                  active={activeItem === "home"}
                  onClick={() => setActiveItem("home")}
                  style={{
                    background: "transparent",
                    color: colors.primary,
                    fontWeight: activeItem === "home" ? "bold" : "normal",
                    borderBottom:
                      activeItem === "home"
                        ? `2px solid ${colors.secondary}`
                        : "none",
                    borderRadius: "0",
                    padding: "0.8em 1em",
                    margin: "0 0.3rem",
                  }}
                >
                  <Icon name="home" className="customIcon" /> Home
                </Button>

                <Dropdown
                  trigger={<UserAvatar />}
                  pointing="top right"
                  icon={null}
                  className="user-dropdown"
                >
                  <Dropdown.Menu style={{ marginTop: "10px", width: "180px" }}>
                    <Dropdown.Item onClick={() => setProfileModalOpen(true)}>
                      <Icon name="user circle" color="teal" /> View Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <Icon name="sign out" color="red" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <ProfileModal />
      </>
    );
  }

  // Desktop menu - not logged in
  if (!isMobile && !user) {
    return (
      <Menu
        secondary
        style={{
          backgroundColor: colors.menuBackground,
          padding: "0.5rem 1rem",
          margin: 0,
          boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Menu.Item as={Link} to="/">
          <Logo />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              name="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to="/login"
              style={{
                backgroundColor: "transparent",
                color: colors.primary,
                fontWeight: "500",
                padding: "0.8em 1.5em",
                marginRight: "1rem",
                borderRadius: "6px",
                border: `1px solid ${colors.primary}`,
              }}
            >
              <Icon name="sign in" /> Login
            </Button>
            <Button
              name="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
              as={Link}
              to="/register"
              style={{
                background: `linear-gradient(to right, ${colors.secondary}, ${colors.secondary}CC)`,
                color: "white",
                fontWeight: "500",
                borderRadius: "6px",
                padding: "0.8em 1.5em",
                boxShadow: "0 2px 8px rgba(255,122,69,0.3)",
                border: "none",
              }}
            >
              <Icon name="user plus" /> Register
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  // Mobile menu for both logged in and not logged in
  return (
    <>
      <Menu
        secondary
        style={{
          backgroundColor: colors.menuBackground,
          padding: "0.5rem 1rem",
          margin: 0,
          boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Menu.Item as={Link} to="/">
          <Logo />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <MobileMenu />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <ProfileModal />
      <style>{`
        .mobile-dropdown .menu {
          min-width: 180px !important;
        }
        .user-dropdown .menu {
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}

export default MenuBar;
