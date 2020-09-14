const Company = require("../models/Company");
const Comment = require("../models/Comment");

exports.modififyCommentById = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const commentToUpdate = await Comment.findByIdAndUpdate(
      { _id: comment_id },
      { _id: comment_id, ...req.body }
    );

    console.log(commentToUpdate);
    const newListOfCommentsForCompanyId = await Comment.find({
      company_id: commentToUpdate.company_id,
    }).sort({ date: -1 });

    res.json({ success: true, data: newListOfCommentsForCompanyId });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.deleteCommentById = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const commentToDelete = await Comment.findOne({ _id: comment_id });

    await Comment.deleteOne({ _id: comment_id });

    await Company.updateOne(
      { _id: commentToDelete.company_id },
      {
        $pull: { comments: { _id: comment_id } },
      }
    );

    const newListOfCommentsForCompanyId = await Comment.find({
      company_id: commentToDelete.company_id,
    }).sort({ date: -1 });

    res.json({ success: true, data: newListOfCommentsForCompanyId });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
