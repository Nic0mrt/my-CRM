const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    role: {
      type: String,
      enum: ["prospect", "client"],
      default: "prospect",
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
    type: Number,
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
        date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },

  callback: {
    type: Date,
  },
});

module.exports = mongoose.model("Company", CompanySchema);
