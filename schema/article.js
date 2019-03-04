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

module.exports = ArticleSchema