// This is a higher order Component(HOC).
import React, { Component, useContext } from "react";
import { AuthContext } from "../../store/Context";
import { Navigate } from "react-router-dom";

const WithAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const { user } = useContext(AuthContext);

    return user ? <Component {...props} /> : <Navigate to="/login" />;
  };
  return AuthenticatedComponent;
};

export default WithAuth;
