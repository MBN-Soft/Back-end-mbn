// // src/middleware/validateObjectId.js
// const mongoose = require("mongoose");

// const validateObjectId = (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid ID format",
//     });
//   }

//   next();
// };

// module.exports = validateObjectId;
// src/middleware/validateUUID.js
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  next();
};

module.exports = validateObjectId;
