const Company = require("../models/Company");
const Contact = require("../models/Contact");
const Invoice = require("../models/Invoice");
const Comment = require("../models/Comment");
const { setMaxListeners } = require("../models/Company");
const { options } = require("../routes/contacts");

const LIMIT = 10;

exports.getCompanies = async (req, res) => {
  try {
    const { type, page, search } = req.query;
    const startIndex = (page - 1) * LIMIT;
    const endIndex = page * LIMIT;

    const allCompanies = await Company.find({ role: type })
      .sort({ name: 1 })
      .populate({
        path: "contacts",
        options: { sort: { name: 1, firstname: 1 } },
      })
      .populate("invoices")
      .populate({ path: "comments", options: { sort: { date: -1 } } });

    let companiesToSend = allCompanies;

    if (search != undefined) {
      companiesToSend = companiesToSend.filter((company) => {
        return (
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.location.city.toLowerCase().includes(search.toLowerCase()) ||
          company.location.postCode
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          company.activity.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    const totalLength = companiesToSend.length;
    companiesToSend = companiesToSend.slice(startIndex, endIndex);
    res.json({ success: true, data: companiesToSend, totalLength });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.getContactsByCompanyId = async (req, res) => {
  try {
    const contacts = await Contact.find({ company_id: req.params.id }).sort(
      { name: 1 }.sort({ firstname: 1 })
    );

    res.json({ success: true, data: contacts });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createContactByCompanyId = async (req, res) => {
  try {
    let { name, firstname, position, phone, mobile, email, gender } = req.body;
    name = String(name.toUpperCase());
    email = String(email.toLowerCase());
    const company_id = req.params.id;

    const contactToSave = new Contact({
      name,
      firstname,
      position,
      phone,
      mobile,
      email,
      gender,
      company_id,
    });

    await contactToSave.save();

    const companyToUpdate = await Company.findByIdAndUpdate(
      company_id,
      { $push: { contacts: contactToSave._id } },
      { new: true, useFindAndModify: false }
    )
      .populate("contacts")
      .populate("invoices");

    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getCommentsByCompanyId = async (req, res) => {
  try {
    const comments = await Comment.find({ company_id: req.params.id }).sort({
      date: -1,
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.json({ success: false, error });
  }
};

exports.createCommentByCompanyId = async (req, res) => {
  try {
    let { description, contact } = req.body;

    const company_id = req.params.id;

    const commentToSave = new Comment({
      description,
      contact,
      company_id,
    });

    await commentToSave.save();

    const companyToUpdate = await Company.findByIdAndUpdate(
      company_id,
      { $push: { comments: commentToSave._id } },
      { new: true, useFindAndModify: false }
    )
      .populate("contacts")
      .populate("invoices")
      .populate("comments");

    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
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
    console.log("error company creation");
    res.json({ success: false, error });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
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
