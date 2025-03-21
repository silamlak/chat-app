import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate(-1);
    }
  }, [isAuth, navigate]);

  if (isAuth) return null;
  return children;
};

export default PublicRoute;
