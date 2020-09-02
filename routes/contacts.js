const express = require("express");
const {
  getContacts,
  createContactForCompany,
  getContactsByCompanyId,
  deleteContactByCompanyId,
  modifyContactWithId,
} = require("../controller/contacts");

const router = express.Router();

router.route("/:contact_id").put(modifyContactWithId);

router
  .route("/company/:company_id")
  .get(getContactsByCompanyId)
  .post(createContactForCompany)
  .delete(deleteContactByCompanyId);
router.route("/").get(getContacts);

module.exports = router;
