import { useEffect, useState } from "react";
import {
  addChatFriend,
  addNewFriend,
  clearMessage,
  selectconversation,
} from "../feature/chat/chatSlice";
import { useQuery } from "@tanstack/react-query";
import { getNewUsers } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiAddLargeFill } from "react-icons/ri";
import { setLoading } from "../feature/loaderSlice";
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

const NewFriens = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoadingStatus = useSelector((state) => state.loader.isLoading);

  const [newUser, setNewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersPerPage = 2;
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

  const openModal = () => {
    setIsModalOpen(true);
  };

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
    dispatch(clearMessage());
    dispatch(selectconversation("new"));
    dispatch(addNewFriend(data));
    closeModal();
    navigate(`/new-user`);
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [newUsers, isLoading, dispatch]);

  return (
    <div className="relative">
      {/* Add Button */}
      <button
        onClick={handleNewUserClick}
        disabled={isLoadingStatus}
        className={`${
          isLoadingStatus ? "cursor-not-allowed" : "cursor-pointer"
        } button-css`}
      >
        <RiAddLargeFill className="text-2x text-slate-800 font-extrabold dark:text-slate-100" />
      </button>

      {/* Modal */}
      {!isLoading && isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                New Users
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <RiCloseLine className="text-2xl text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Users List */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {currentUsers.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No new users found
                  </p>
                ) : (
                  currentUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => getNewUserData(user)}
                      className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg 
                    hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer 
                    transition-all duration-150"
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination Footer */}
            {currentUsers.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                bg-blue-600 text-white disabled:bg-gray-300 
                disabled:cursor-not-allowed cursor-pointer hover:bg-blue-700 
                transition-colors duration-200"
                >
                  <RiArrowLeftSLine className="text-xl" />
                  <span>Previous</span>
                </button>

                <span className="text-gray-600 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                bg-blue-600 text-white disabled:bg-gray-300 
                disabled:cursor-not-allowed cursor-pointer hover:bg-blue-700 
                transition-colors duration-200"
                >
                  <span>Next</span>
                  <RiArrowRightSLine className="text-xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewFriens;
