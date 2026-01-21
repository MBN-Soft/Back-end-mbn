
const supabase = require("../utils/supabaseClient");

// User sends Contact Us form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service_type, message, status } = req.body;

    if (!name || !email || !message || !phone || !service_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email: email.toLowerCase().trim(),
        phone: phone.toString(), // لضمان تخزين الرقم كـ text
        service_type,
        message,
        status: status || "pending" // إذا لم يُرسل status
      });

    if (error) throw error;

    res.json({ success: true, message: "Form submitted successfully. Thank you!" });

  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error submitting form", 
      error: err.message 
    });
  }
};

module.exports = {
  submitContactForm
};
