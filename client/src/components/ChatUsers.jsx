import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUsers } from "../feature/chat/chatApi";
import { addUser, selectUser } from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Theme from "../utils/theme";
import Avatar from "./Avatar";

const ChatUsers = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.chat.users) || [];
  const myId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (data) {
      dispatch(addUser(data));
    }
  }, [data, dispatch]);

  const handleUserClick = (userId) => {
    if (myId == userId) return;
    dispatch(selectUser(userId));
    navigate(`/${userId}`);
  };
  console.log(myId);
  return (
    <div className="">
      <Theme />
      <div className="dark:text-slate-50 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {Array.isArray(users) &&
              users &&
              users?.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center p-2 rounded-sm bg-slate-100 dark:bg-slate-800 mb-1 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-none duration-300"
                >
                  <Avatar name={user.name} imageUrl={user.imageUrl} size={50} />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm">Online</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
