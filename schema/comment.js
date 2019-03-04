const { Schema } = require('./config');
const ObjectId = Schema.Types.ObjectId

//头像 用户名 文章 内容
const CommentSchema = new Schema({
  //评论内容
  content: String,
  //关联到 users
  from: {
    type: ObjectId,
    ref: "users"
  },
  //关联到 articles
  article: {
    type: ObjectId,
    ref: "articles"
  }
}, {
    versionKey: false, timestamps: {
      createdAt: "created"
    }
  })

module.exports = CommentSchema