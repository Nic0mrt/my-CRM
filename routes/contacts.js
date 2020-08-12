const express = require("express");
const {
  getContacts,
  createContactForCompany,
} = require("../controller/contacts");

const router = express.Router();

router.route("/:company_id").post(createContactForCompany);
router.route("/").get(getContacts);

module.exports = router;
