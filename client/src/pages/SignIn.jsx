import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInValidation } from "../utils/hook.validation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../feature/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserId } from "../feature/auth/authSlice";
import { IoMdChatboxes } from "react-icons/io";
import { FaUser, FaLock } from "react-icons/fa";
import { DotsLoader } from "../components/Loader";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInValidation),
  });

  const mutation = useMutation({
    mutationFn: (data) => signIn(data),
    onSuccess: async (data) => {
      dispatch(setUser(data?.accessToken));
      dispatch(setUserId(data?.user?._id));
      if (user) navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex items-center gap-2 text-blue-700 text-3xl font-bold mb-4">
        <IoMdChatboxes size={40} />
        <span>ChatApp</span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md bg-white shadow-2xl p-8 rounded-2xl mx-auto w-full"
      >
        <div className="flex items-center justify-center gap-2 mb-6 text-slate-600 text-xl font-semibold">
          <h2 className="text-md">Please Sign In to your account</h2>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <div className="flex items-center border-2 border-gray-300 rounded-lg p-3">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              id="email"
              className="w-full text-sm text-gray-900 bg-transparent border-0 focus:outline-none"
              placeholder="Email address"
              {...register("email")}
            />
          </div>
          <p className="text-red-500 text-xs mt-1">{errors?.email?.message}</p>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <div className="flex items-center border-2 border-gray-300 rounded-lg p-3">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              id="password"
              className="w-full text-sm text-gray-900 bg-transparent border-0 focus:outline-none"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <p className="text-red-500 text-xs mt-1">
            {errors?.password?.message}
          </p>
          <div className="text-right mt-1">
            <a
              href="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className={`text-white h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full px-2 py-2 text-center ${
            mutation.isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {mutation.isPending ? <DotsLoader /> : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
