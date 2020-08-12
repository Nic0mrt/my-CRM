const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./modules/db");

dotenv.config({ path: "./config.env" });

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use("/companies", require("./routes/companies"));
app.use("/invoices", require("./routes/invoices"));
app.use("/contacts", require("./routes/contacts"));

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
