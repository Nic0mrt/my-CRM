const express = require("express");
const {
  deleteCommentById,
  modififyCommentById,
} = require("../controller/comments");

const router = express.Router();

router.route("/:comment_id").put(modififyCommentById).delete(deleteCommentById);

module.exports = router;
