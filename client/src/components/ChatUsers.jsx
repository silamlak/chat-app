import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMessages, getUsers } from "../feature/chat/chatApi";
import {
  addConversation,
  addMessages,
  addUser,
  selectUser,
} from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    if (myId == userId) return
    dispatch(selectUser(userId));
    navigate(`/${userId}`);
  };
  console.log(myId)
  return (
    <div>
      {/* Sidebar */}
      <div className="bg-gray-100 p-4 overflow-y-auto">
        {/* User List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {/* Map through your contacts here */}
            {Array.isArray(users) &&
              users &&
              users?.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center p-2 rounded-lg bg-gray-300 mb-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </li>
              ))}

            {/* Add more users as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
