import { useMutation, useQuery } from '@tanstack/react-query'
import { getMessages, getUsers, sendMessage } from '../feature/chat/chatApi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addConversation, addMessages, addUser } from '../feature/chat/chatSlice';

const Home = () => {
const dispatch = useDispatch();
const users = useSelector((state) => state.chat.users);
const messages = useSelector((state) => state.chat.messages);
const conversationId = useSelector((state) => state.chat.conversationId);
const myId = useSelector((state) => state.auth.userId);
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
        queryFn: () => getMessages(userId),
        enabled: !!userId,
      });

      useEffect(() => {
        if (messageData) {
          dispatch(addMessages(messageData?.newConversation));
          dispatch(addConversation(messageData?.conversationId));
          console.log(messageData)
        }
      }, [messageData, dispatch]);

  const handleUserClick = (userId) => {
    setUserId(userId)
  }

  const mutation = useMutation({
    mutationFn: (text) => sendMessage(conversationId, text),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target[0].value;
    console.log(text)
    mutation.mutate(text);
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
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Chat with User 1</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {!messages && (
            <div className="text-center text-gray-500">Select a user to chat</div>
          )}
          {messages?.map((message) => (
            <div key={message?._id} className={`mb-4 ${message?.sender === myId ? 'text-right': ''}`}>
              <div className="bg-blue-100 p-2 rounded-lg inline-block">
                {message?.text}
              </div>
              <div className="text-sm text-gray-500 mt-1">10:00 AM</div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <form onSubmit={(e) => handleSubmit(e)} className="flex">
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
