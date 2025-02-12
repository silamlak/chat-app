import { useQuery } from '@tanstack/react-query'
import { getMessages, getUsers } from '../feature/chat/chatApi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../feature/chat/chatSlice';

const Home = () => {
const dispatch = useDispatch();
const users = useSelector((state) => state.chat.users);
const user = useSelector((state) => state.chaauth.user);
const [userId, setUserId] = useState(null);
  const {data} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  useEffect(() => {
    if(data) {
      dispatch(addUser(data));
    }
  }, [data, dispatch])

      const { data: messageData } = useQuery({
        queryKey: ["messages", userId],
        queryFn: getMessages(userId),
        enabled: !!userId,
      });

      useEffect(() => {
        if (messageData) {
          console.log(messageData)
        }
      }, [messageData]);

  const handleUserClick = (userId) => {
    setUserId(userId)
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Chat with User 1</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Map through your messages here */}
          <div className="mb-4">
            <div className="bg-blue-100 p-2 rounded-lg inline-block">
              Hello! How are you?
            </div>
            <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
          </div>
          <div className="mb-4 text-right">
            <div className="bg-green-100 p-2 rounded-lg inline-block">
              I'm good, thanks! How about you?
            </div>
            <div className="text-sm text-gray-500 mt-1">10:02 AM</div>
          </div>
          {/* Add more messages as needed */}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form className="flex">
            <input
              type="text"
              className="flex-1 border rounded-l-lg p-2"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home
