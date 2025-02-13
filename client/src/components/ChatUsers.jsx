import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { getMessages } from '../feature/chat/chatApi';
import { addConversation, addMessages, selectUser } from '../feature/chat/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useRoutes } from 'react-router-dom';

const ChatUsers = () => {
  const navigate = useNavigate()
  const users = useSelector((state) => state.chat.users);
  const userId = useSelector((state) => state.chat.selectedUser);
  const dispatch = useDispatch();
        const { data: messageData } = useQuery({
          queryKey: ["messages", userId],
          queryFn: () => getMessages(userId),
          enabled: !!userId,
        });

        useEffect(() => {
          if (messageData) {
            dispatch(addMessages(messageData?.newConversation));
            dispatch(addConversation(messageData?.conversationId));
            console.log(messageData);
          }
        }, [messageData, dispatch]);

        const handleUserClick = (userId) => {
          dispatch(selectUser(userId));
          navigate(`/${userId}`);        };
  return (
    <div>
      {/* Sidebar */}
      <div className="bg-gray-100 p-4 overflow-y-auto">
        {/* User List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {/* Map through your contacts here */}
            {users?.map((user) => (
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
}

export default ChatUsers
