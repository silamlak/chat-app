import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  // console.log(isAuth)

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in");
    }
  }, [isAuth, navigate]);

  if (!isAuth) return null;
  return children;
};

export default PrivateRoute;
