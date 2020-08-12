const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  firstname: { type: String },
  name: { type: String, required: true },
  position: {
    type: String,
  },
  phone: {
    type: String,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Mme", "M"],
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
