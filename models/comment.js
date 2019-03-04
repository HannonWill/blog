const { db } = require("../schema/config");

const CommentSchema = require("../schema/comment");

//控制评论的 
const Comment = db.model("comments", CommentSchema);

module.exports = Comment