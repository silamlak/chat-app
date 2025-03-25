import { IoPersonSharp } from "react-icons/io5";

const Avatar = ({ name, imageUrl, size = 40, isOnline }) => {
  const getInitials = (name) => {
    const nameParts = name?.split(" ");
    const initials = nameParts?.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl mr-2 bg-blue-500`}
      style={{
        width: size,
        height: size,
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span
          className="text-white text-md"
        >
          {getInitials(name) || <IoPersonSharp />}
        </span>
      )}
      {/* {online && ( */}
      {isOnline && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
