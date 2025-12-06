// src/controllers/adminController.js
const ContactMessage = require("../Models/ContactMessage");

const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message", error: err.message });
  }
};

module.exports = {
  getAllMessages,
  deleteMessage,
};
