import conversationModel from "../model/conversation.model.js";
import messageModel from "../model/message.model.js";
import userModel from "../model/user.model.js";

export const getConversations = async (req, res, next) => {
  try {
    const id = req.user._id.toString();
    const conversations = await conversationModel.find({
      participants: id,
    });

    if (!conversations || conversations.length === 0) {
      return res.status(200).json({ conversations: [] });
    }

    const friendIds = conversations.reduce((acc, conversation) => {
      const friends = conversation.participants.filter(
        (participant) => participant.toString() !== id
      );
      return acc.concat(friends);
    }, []);

    const friends = await userModel.find({
      _id: { $in: friendIds },
    });

    const conversationWithFriends = conversations.map((conversation) => {
      const friendId = conversation.participants.find(
        (participant) => participant.toString() !== id
      );

      const friend = friends.find(
        (friend) => friend._id.toString() === friendId.toString()
      );

      return {
        ...conversation._doc,
        friend: friend || null,
      };
    });

    res.status(200).json(conversationWithFriends);
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const newConversation = await conversationModel.create(req.body);
    res.status(200).json(newConversation);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const conversation = await conversationModel.findById(conversation_id);
    if (!conversation) {
      return res.status(200).json({ messages: [], conversationId: null });
    }

    const messages = await messageModel.find({
      conversationId: conversation._id,
    });
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const createMessages = async (req, res, next) => {
  try {
    let { conversation_id } = req.params;
    const id = req.user._id.toString();
    let newConversation;
    console.log(conversation_id, id);
    if (
      conversation_id === "undefined" ||
      conversation_id === "null" ||
      conversation_id === "new"
    ) {
      newConversation = await conversationModel.create({
        participants: [id, req.body.reciever],
      });
      conversation_id = newConversation._id?.toString();
    }

    console.log(req.body);

    const message = await messageModel.create({
      ...req.body,
      conversationId: conversation_id,
      sender: id,
    });

    const friend = await userModel.findById(req.body.reciever)

    const conversationWithUser = {
      ...newConversation?._doc,
      friend,
    };

    if (newConversation) {
      res.status(200).json({ message, conversationWithUser });
      return;
    }
    res.status(200).json({message});
  } catch (error) {
    next(error);
  }
};

export const getNewUsers = async (req, res, next) => {
  try {
    const id = req.user._id.toString();
    const conversation = await conversationModel.find({
      participants: id,
    });
    const friendIds = conversation.reduce((acc, conversation) => {
      const friends = conversation.participants.filter(
        (participant) => participant.toString() !== id
      );
      return acc.concat(friends);
    }, []);

    const users = await userModel.find({
      _id: { $nin: [id, ...friendIds] },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
