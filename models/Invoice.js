const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  autoIncrement = require("mongoose-auto-increment");

let connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
autoIncrement.initialize(connection);

const InvoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["En attente", "Envoyée", "Payée"],
    default: "En attente",
  },

  type: {
    type: String,
    enum: ["Avoir", "Facture"],
    default: "Facture",
  },

  subject: {
    type: String,
    required: true,
  },
  items: {
    type: [
      {
        description: {
          type: String,
          required: true,
        },
        priceHT: {
          type: Number,
          required: true,
        },
      },
    ],
  },

  total: {
    type: Number,
  },
});

InvoiceSchema.methods.getTotalPrice = function getTotalPrice() {
  let total = 0;
  this.items.forEach((item) => {
    total += item.priceHT;
  });
  return total;
};

InvoiceSchema.methods.setTotalPrice = function () {
  let total = 0;
  this.items.forEach((item) => {
    total += item.priceHT;
  });
  this.total = total;
};

InvoiceSchema.plugin(autoIncrement.plugin, {
  model: "Invoice",
  field: "invoiceNumber",
  startAt: 100,
  incrementBy: 1,
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
