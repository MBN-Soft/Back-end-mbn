// src/controllers/contactController.js
const ContactMessage = require("../Models/ContactMessage");

// User sends Contact Us form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service_type, message } = req.body;

    if (!name || !email || !message || !phone || !service_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await ContactMessage.create({ name, email, phone, service_type, message });

    res.json({ success: true, message: "Form submitted successfully Thank You Sir" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error submitting form", error: err.message });
  }
};

module.exports = {
  submitContactForm,
};
