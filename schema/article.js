const { Schema } = require("./config");
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title: String,
  content: String,
  //必须关联 users 的集合
  author: {
    type: ObjectId,
    ref: "users"
  },
  tips: String,
  commentNum: {
    type: Number,
    default: 0
  }
}, {
    versionKey: false, timestamps: {
      createdAt: "created"
    }
  })

ArticleSchema.post("remove", doc => {
  const Comment = require('../models/Comment');
  const User = require('../models/user');
  const { _id: artId, author: authorId } = doc

  //当前用户文章-1
  User.findByIdAndUpdate(authorId, { $inc: { articleNum: -1 } }).exec()

  //评论调用remove
  Comment.find({ article: artId })
    .then(data => {
      data.forEach(v => v.remove())
    })
})

module.exports = ArticleSchema