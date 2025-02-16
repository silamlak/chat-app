import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getconversations,
  getNewUsers,
  updateReadMessage,
} from "../feature/chat/chatApi";
import {
  addChatFriend,
  addconversations,
  selectconversation,
  updateMessageRead,
} from "../feature/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Theme from "../utils/theme";
import Avatar from "./Avatar";
import socket from "../utils/socketConection";

const ChatUsers = () => {
  const navigate = useNavigate();
  const conversations = useSelector((state) => state.chat.conversation) || [];
  const selectedConversation = useSelector(
    (state) => state.chat.selectedConversation
  );
  const myId = useSelector((state) => state.auth.userId);
  const [newUser, setNewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersPerPage = 2;

  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["conversations"],
    queryFn: getconversations,
  });

  useEffect(() => {
    socket.on("recieveupdateMessageRead", (data) => {
      dispatch(updateMessageRead(data?.conversationId));
    });
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(addconversations(data));
    }
  }, [data, dispatch]);

  const mutation = useMutation({
    mutationFn: (ids) => updateReadMessage(ids),
    onSuccess: (data) => {
      console.log(data);
      socket.emit("updateMessageRead", data);
      dispatch(updateMessageRead(selectedConversation?._id));
    },
  });

  const handleUserClick = (conversation) => {
    if (!conversation) return;
    dispatch(selectconversation(conversation));
    dispatch(addChatFriend(conversation?.friend));
    navigate(`/${conversation?._id}`);
    if (!conversation?.message?.isRead) {
      mutation.mutate({
        conversationId: conversation?._id,
        messageId: conversation?.message?._id,
      });
    }
  };

  const { data: newUsers, isLoading } = useQuery({
    queryKey: ["new_users"],
    queryFn: () => getNewUsers(),
    enabled: newUser,
  });

  // Pagination Logic
  const totalPages = newUsers ? Math.ceil(newUsers.length / usersPerPage) : 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = newUsers
    ? newUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleNewUserClick = () => {
    setNewUser(true);
    openModal();
  };

  const getNewUserData = (data) => {
    setNewUser(false);
    dispatch(addChatFriend(data));
    dispatch(selectconversation("new"));
    closeModal();
    navigate(`/new-user`);
  };

  return (
    <div className="relative">
      <button onClick={handleNewUserClick}>get new user</button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 top-0 right-0 left-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-h-[80%] overflow-auto relative z-60">
            <h2 className="text-2xl font-semibold mb-4">New Users</h2>

            {/* Users List */}
            <div className="space-y-4">
              {currentUsers.length === 0 ? (
                <p>No new users found</p>
              ) : (
                currentUsers.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => getNewUserData(user)}
                    className="border p-4 rounded-lg shadow-sm cursor-pointer"
                  >
                    <h3 className="font-semibold">{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                Previous
              </button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              >
                Next
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Theme />
      <div className="dark:text-slate-50 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <ul>
            {Array.isArray(conversations) &&
              conversations &&
              conversations?.map((conversation) => (
                <li
                  key={conversation?._id}
                  onClick={() => handleUserClick(conversation)}
                  className="flex items-center p-2 rounded-sm bg-slate-100 dark:bg-slate-800 mb-1 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-none duration-300"
                >
                  <Avatar
                    name={conversation?.friend?.name}
                    imageUrl={conversation?.friend?.imageUrl}
                    size={50}
                    isOnline={conversation?.friend?.isOnline}
                  />
                  <div>
                    <h3 className="font-semibold">
                      {conversation?.friend?.name}
                    </h3>
                    {conversation?.message?.sender == myId && (
                      <div className="relative">
                        <p className={` whitespace-nowrap `}>
                          {conversation?.message?.text}
                        </p>
                        {conversation?.message?.isRead ? (
                          <p>Read</p>
                        ) : (
                          <p>Not-Read</p>
                        )}
                      </div>
                    )}
                    <p
                      className={` whitespace-nowrap ${
                        conversation?.message?.isRead ? `text-sm` : `font-bold`
                      } `}
                    >
                      {conversation?.message?.text}
                    </p>
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
