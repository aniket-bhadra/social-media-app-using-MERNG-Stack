import React, { useContext, useEffect, useState } from "react";
import { Image, Menu, Icon, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import getAnonymousUsername from "../config/anonymity";

// Simplified color theme
const colors = {
  background: "#F5F8FC",
  primary: "#0D2B4B",
  secondary: "#FF7A45",
};

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.slice(1);
  const [activeItem, setActiveItem] = useState(path);
  const [displayedUsername, setDisplayedUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
          borderRadius: "8px",
          padding: "1px",
          marginRight: "10px",
          width: "42px", // Set fixed width
          height: "42px", // Set fixed height
          display: "flex", // Use flex to center the image
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
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
            fontSize: "1.3rem",
          }}
        >
          PostW<span style={{ color: colors.secondary }}>i</span>nd
        </span>
      )}
    </div>
  );

  // User Avatar component
  const UserAvatar = () => (
    <div style={{ textAlign: "center" }}>
      <Image
        src={
          avatar ||
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
        }
        avatar
        style={{ border: `2px solid ${colors.secondary}` }}
      />
      <div
        style={{
          fontSize: "0.8rem",
          color: colors.primary,
          marginTop: "2px",
        }}
      >
        {displayedUsername || "Anonymous"}
      </div>
    </div>
  );

  // Mobile menu
  const MobileMenu = () => (
    <Dropdown icon="bars">
      <Dropdown.Menu>
        {user ? (
          <>
            <Dropdown.Item as={Link} to="/">
              <Icon name="home" /> Home
            </Dropdown.Item>
            <Dropdown.Item>
              <Icon name="user" /> Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>
              <Icon name="sign out" /> Logout
            </Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item as={Link} to="/">
              <Icon name="home" /> Home
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/login">
              <Icon name="sign in" /> Login
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/register">
              <Icon name="user plus" /> Register
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  // Desktop menu - logged in user
  if (!isMobile && user) {
    return (
      <Menu secondary style={{ backgroundColor: colors.background }}>
        <Menu.Item as={Link} to="/">
          <Logo />
        </Menu.Item>

        <Menu.Menu position="right">

          <Menu.Item>
            <Dropdown trigger={<UserAvatar />} pointing="top right" icon={null}>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name="user" /> Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  <Icon name="sign out" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  // Desktop menu - not logged in
  if (!isMobile && !user) {
    return (
      <Menu secondary style={{ backgroundColor: colors.background }}>
        <Menu.Item as={Link} to="/">
          <Logo />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          >
            <Icon name="sign in" /> Login
          </Menu.Item>
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
            style={{
              backgroundColor: colors.secondary,
              color: "white",
              borderRadius: "8px",
            }}
          >
            <Icon name="user plus" /> Register
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  // Mobile menu for both logged in and not logged in
  return (
    <Menu secondary style={{ backgroundColor: colors.background }}>
      <Menu.Item as={Link} to="/">
        <Logo />
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          <MobileMenu />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default MenuBar;
