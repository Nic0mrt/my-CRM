const express = require("express");
const { getInvoices, addIvoice } = require("../controller/invoices");

const router = express.Router();

router.route("/").get(getInvoices).post(addIvoice);

module.exports = router;
