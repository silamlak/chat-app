import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exists"],
      match: [/^\S+@\S+\.\S+$/, "email is invalid"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    socketId: {
      type: String,
      // required: true,
    },
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema)

