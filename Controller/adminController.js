// src/controllers/adminController.js
// const ContactMessage = require("../Models/ContactMessage");
const supabase = require("../utils/supabaseClient");


const getAllMessages = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }); // آخر الرسائل أولاً

    if (error) throw error;

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Message deleted", data });
  } catch (err) {
    res.status(500).json({ message: "Error deleting message", error: err.message });
  }
};


module.exports = {
  getAllMessages,
  deleteMessage,
};
