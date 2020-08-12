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
    let { name, firstname, phone, mobile, email, gender } = req.body;
    name = String(name.toUpperCase());
    email = String(email.toLowerCase());
    const contactToSave = new Contact({
      name,
      firstname,
      phone,
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
    res.json({ success: false, error });
  }
};
