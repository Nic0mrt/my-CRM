const Company = require("../models/Company");
const Comment = require("../models/Comment");

exports.modififyCommentById = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const commentToUpdate = await Comment.updateOne(
      { _id: comment_id },
      { _id: comment_id, ...req.body }
    );

    res.json({ success: true, data: commentToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const commentToDelete = await Comment.findOne({ _id: comment_id });

    await Comment.deleteOne({ _id: comment_id });

    const companyToUpdate = await Company.updateOne(
      { _id: commentToDelete.company_id },
      {
        $pull: { comments: { _id: comment_id } },
      }
    )
      .populate("contacts")
      .populate("invoices")
      .populate("comments");

    res.json({ success: true, data: companyToUpdate });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
