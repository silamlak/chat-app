import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {changeTheme} from '../feature/themeSlice'
import { CgDarkMode } from "react-icons/cg";
import { MdLightMode } from "react-icons/md";

const Theme = () => {
  const dispatch = useDispatch()
 const isLoadingStatus = useSelector((state) => state.loader.isLoading);
  const myTheme = useSelector(state => state.theme.theme)
  const [theme, setTheme] = useState(myTheme) || 'light';

  useEffect(() => {
    document.documentElement.className = theme;
    dispatch(changeTheme(theme));
  }, [theme, dispatch]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  return (
    <div>
      <button
        onClick={toggleTheme}
        className={`${
          isLoadingStatus ? "cursor-not-allowed" : "cursor-pointer"
        } button-css`}
      >
        {myTheme === "light" ? (
          <CgDarkMode />
        ) : (
          <MdLightMode className="text-slate-100 font-extrabold text" />
        )}
      </button>
    </div>
  );
};

export default Theme;
