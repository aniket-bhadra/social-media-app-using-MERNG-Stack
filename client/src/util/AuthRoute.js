//this component working is opposite to the protected route component
import React, { useContext } from "react";

import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

function AuthRoute(props) {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }

  return props.children;
}

export default AuthRoute;
