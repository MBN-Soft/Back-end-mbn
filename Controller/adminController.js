// // src/controllers/adminController.js
// // const ContactMessage = require("../Models/ContactMessage");
// const supabase = require("../utils/supabaseClient");


// const getAllMessages = async (req, res) => {
//   try {
//     const { data: messages, error } = await supabase
//       .from("contact_messages")
//       .select("*")
//       .order("created_at", { ascending: false }); // آخر الرسائل أولاً

//     if (error) throw error;

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages", error: err.message });
//   }
// };


// const deleteMessage = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("contact_messages")
//       .delete()
//       .eq("id", req.params.id);

//     if (error) throw error;

//     res.json({ message: "Message deleted", data });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting message", error: err.message });
//   }
// };


// module.exports = {
//   getAllMessages,
//   deleteMessage,
// };

// src/controllers/adminController.js

const { prisma } = require("../Config/prisma");

const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("getAllMessages error:", err);

    return res.status(500).json({
      message: "Error fetching messages",
      error: err.message,
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      return res.status(400).json({
        message: "Invalid message ID",
      });
    }

    const existingMessage = await prisma.contactMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!existingMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const deletedMessage = await prisma.contactMessage.delete({
      where: {
        id: messageId,
      },
    });

    return res.status(200).json({
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (err) {
    console.error("deleteMessage error:", err);

    return res.status(500).json({
      message: "Error deleting message",
      error: err.message,
    });
  }
};

module.exports = {
  getAllMessages,
  deleteMessage,
};