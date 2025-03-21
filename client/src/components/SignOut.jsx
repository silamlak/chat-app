import { useMutation } from "@tanstack/react-query";
import { signOut } from "../feature/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../feature/auth/authSlice";
import { IoMdLogOut } from "react-icons/io";

const SignOut = () => {
  const dispatch = useDispatch()
  const mutations = useMutation({
    mutationFn: (data) => signOut(data),
    onSuccess: (data) => {
      console.log(data);
      dispatch(logout());
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const hadleLogout = () => {
    mutations.mutate();
  };
  return (
    <div>
      <button
        onClick={() => hadleLogout()}
        className="button-css bg-blue-500 cursor-pointer flex justify-center items-center gap-1"
      >
        <IoMdLogOut className="text-xl text-slate-100" />
      </button>
    </div>
  );
};

export default SignOut;
