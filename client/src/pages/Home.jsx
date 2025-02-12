const Home = () => {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        {/* User List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {/* Map through your contacts here */}
            <li className="p-2 hover:bg-gray-200 cursor-pointer">User 1</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">User 2</li>
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
