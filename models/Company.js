const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["prospect", "client"],
    default: "prospect",
  },
  location: {
    city: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    postCode: {
      type: String,
      default: "",
    },
    coodinates: {
      type: [
        {
          x: {
            type: Number,
          },
          y: {
            type: Number,
          },
        },
      ],
    },
  },
  phone: {
    type: String,
    default: "",
  },

  turnover: {
    type: String,
  },

  activity: {
    type: String,
    default: "",
  },

  NAF: {
    type: String,
    default: "",
  },

  siret: {
    type: String,
    default: "",
  },
  contacts: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],
  },

  invoices: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
  },

  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  callback: {
    type: Date,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
