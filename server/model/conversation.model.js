import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isGroupChat: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);