import React, { useContext, useEffect, useState } from "react";
import { Image, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import getAnonymousUsername from "../config/anonymity";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.slice(1);
  const [activeItem, setActiveItem] = useState(path);
  const [DisplayedUsername, setDisplayedUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // console.log("a");
  const handleItemClick = (e, { name }) => setActiveItem(name);
  useEffect(() => {
    const { anonymousUsername, avatar } = getAnonymousUsername(user.username);
    setDisplayedUsername(anonymousUsername);
    setAvatar(avatar);
  }, [user.username]);

  const dynamicMenu = user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item name="home" active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item
          name={DisplayedUsername ? DisplayedUsername : "Anonymous"}
          style={{ color: "#B413EC", fontWeight: "bold", fontStyle: "italic" }}
        />
        <Menu.Item name="logout" onClick={logout}>
          <Image floated="right" size="mini" src={avatar ? avatar : ""} />
        </Menu.Item>
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return dynamicMenu;
}

export default MenuBar;
