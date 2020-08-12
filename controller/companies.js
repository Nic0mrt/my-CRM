const Company = require("../models/Company");
const Contact = require("../models/Contact");
const Invoice = require("../models/Invoice");

exports.getCompanies = async (req, res) => {
  try {
    const companiesToSend = await Company.find()
      .sort({ name: 1 })
      .populate("contacts")
      .populate("invoices");
    res.json({ success: true, data: companiesToSend });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.getContactsByCompanyId = async (req, res) => {
  try {
    const companyFound = await Company.findById(req.params.id).populate(
      "contacts"
    );
    res.json({ success: true, data: companyFound.contacts });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createContactByCompanyId = async (req, res) => {
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

    const { id } = req.params;

    await contactToSave.save();

    const companyToUpdate = await Company.findByIdAndUpdate(
      id,
      { $push: { contacts: contactToSave._id } },
      { new: true, useFindAndModify: false }
    )
      .populate("contacts")
      .populate("invoices");

    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.getInvoicesByCompanyId = async (req, res) => {
  try {
    const companyFound = await Company.findById(req.params.id)
      .populate("invoices")
      .populate("contacts");
    res.json({ success: true, data: companyFound.invoices });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createInvoiceByCompanyId = async (req, res) => {
  try {
    const { subject, items } = req.body;
    const { id } = req.params;

    let invoiceTosave = new Invoice({
      subject: subject,
      items: items,
    });
    invoiceTosave.setTotalPrice();
    await invoiceTosave.save();

    const companyToUpdate = await Company.findByIdAndUpdate(
      id,
      { $push: { invoices: invoiceTosave._id } },
      { new: true, useFindAndModify: false }
    )
      .populate("invoices")
      .populate("contacts");
    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const company = req.body;
    console.log(company);
    const companyTosave = new Company(company);
    await companyTosave.save();
    res.json({ success: true, data: companyTosave });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await Company.updateOne({ _id: id }, { ...req.body });
    const updatedCompany = await Company.findOne({ _id: id });
    res.json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await Company.deleteOne({
      _id: id,
    });
    const companiesLeft = await Company.find().sort({ name: 1 });
    res.json({
      success: true,
      data: companiesLeft,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};
