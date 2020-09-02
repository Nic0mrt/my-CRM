const Contact = require("../models/Contact");
const Company = require("../models/Company");

exports.getContacts = async (req, res) => {
  try {
    const usersToSend = await Contact.find().sort({ name: 1 });

    res.json({ success: true, data: usersToSend });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createContactForCompany = async (req, res) => {
  try {
    let { name, firstname, position, phone, mobile, email, gender } = req.body;
    name = String(name.toUpperCase());
    email = String(email.toLowerCase());
    const contactToSave = new Contact({
      name,
      firstname,
      phone,
      position,
      mobile,
      email,
      gender,
    });
    await contactToSave.save();

    const { company_id } = req.params;
    const company = Company.findOne({ _id: company_id });
    if (company.contacts) {
      company.contacts.push(contactToSave._id);
    } else {
      company.contacts = [contactToSave._id];
    }
    await company.updateOne({ _id: company_id, company });

    const newListOfContacts = await Contact.find().sort({ name: 1 });

    res.json({ success: true, data: newListOfContacts });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getContactsByCompanyId = async (req, res) => {
  try {
    const { company_id } = req.params;
    const contactsToSend = await Contact.find({ company_id })
      .sort({ name: 1 })
      .sort({ firstname: 1 });

    res.json({ success: true, data: contactsToSend });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.deleteContactByCompanyId = async (req, res) => {
  try {
    const { contact_id } = req.body;
    const { company_id } = req.params;

    await Contact.deleteOne({ _id: contact_id });

    const companyToUpdate = await Company.updateOne(
      { _id: company_id },
      {
        $pull: { contacts: { _id: contact_id } },
      }
    )
      .populate("contacts")
      .populate("invoices");

    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.modifyContactWithId = async (req, res) => {
  try {
    const { contact_id } = req.params;
    const contactToUpdate = await Contact.updateOne(
      { _id: contact_id },
      { _id: contact_id, ...req.body }
    );

    res.json({ success: true, data: contactToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
