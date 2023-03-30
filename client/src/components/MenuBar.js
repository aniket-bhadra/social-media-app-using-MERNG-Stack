import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.slice(1);
  const [activeItem, setActiveItem] = useState(path);

  // console.log("a");
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const dynamicMenu = user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item name="home" active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item
          name={user.username}
          style={{ color: "#B413EC", fontWeight: "bold", fontStyle: "italic" }}
        />
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
