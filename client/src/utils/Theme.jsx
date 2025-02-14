import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {changeTheme} from '../feature/themeSlice'

const Theme = () => {
  const dispatch = useDispatch()
  const myTheme = useSelector(state => state.theme.theme)
  console.log(myTheme)
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
        className="p-2 mt-4 ml-4 text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default Theme;
