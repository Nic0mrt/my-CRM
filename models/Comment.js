const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },

  contact: { type: String },

  description: { type: String },

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
