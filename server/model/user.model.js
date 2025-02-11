import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "email is invalid"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be at least 6 characters"],
    maxlength: [20, "password must be at most 20 characters"],
  },
}, {timestamps: true});

export default mongoose.model('User', userSchema)

