const Invoice = require("../models/Invoice");

exports.getInvoices = async (req, res) => {
  try {
    const invoicesToReturn = await Invoice.find().sort({ date: -1 });

    res.json({ success: true, data: invoicesToReturn });
  } catch (error) {
    res.json({ error });
  }
};

exports.addIvoice = async (req, res) => {
  try {
    const { company_id, subject, items } = req.body;

    let invoiceTosave = new Invoice({
      company_id: company_id,
      subject: subject,
      items: items,
    });
    invoiceTosave.setTotalPrice();

    await invoiceTosave.save();

    const data = { invoiceTosave };

    res.json({ data });
  } catch (error) {
    res.json({ error });
  }
};
