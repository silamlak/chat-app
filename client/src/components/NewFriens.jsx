import { useEffect, useState } from "react";
import { addChatFriend, selectconversation } from "../feature/chat/chatSlice";
import { useQuery } from "@tanstack/react-query";
import { getNewUsers } from "../feature/chat/chatApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiAddLargeFill } from "react-icons/ri";
import { setLoading } from "../feature/loaderSlice";

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
    dispatch(selectconversation("new"));
    closeModal();
    navigate(`/new-user`);
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [newUsers, isLoading, dispatch]);

  return (
    <div>
      <button
        onClick={handleNewUserClick}
        disabled={isLoadingStatus}
        className={`${
          isLoadingStatus ? "cursor-not-allowed" : "cursor-pointer"
        } button-css`}
      >
        <RiAddLargeFill className="text-2x text-slate-800 font-extrabold dark:text-slate-100" />
      </button>
      {!isLoading && isModalOpen && (
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
    </div>
  );
};

export default NewFriens;
