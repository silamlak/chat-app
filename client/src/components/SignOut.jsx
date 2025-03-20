import { useMutation } from '@tanstack/react-query';
import { signOut } from '../feature/authApi';

const SignOut = () => {
      const mutations = useMutation({
        mutationFn: (data) => signOut(data),
        onError: (error) => {
          console.log(error);
        },
        onSuccess: (data) => {
          console.log(data);
        },
      });

        const hadleLogout = () => {
          mutations.mutate();
        };
  return (
    <div>
      <button
        onClick={() => hadleLogout()}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </div>
  );
}

export default SignOut
