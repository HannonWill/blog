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


//设置 comment 的 remove 的钩子 

//前置钩子
/* CommentSchema.pre("remove", function () {
  //this指向当前文档

}) */

//后置钩子   document 是当前文档
CommentSchema.post("remove", (doc) => {
  //当前这个函数 一定会在remove执行前触发
  //console.log(doc)
  const Article = require('../models/article');
  const User = require('../models/user');

  const { from, article } = doc

  //对应文章的评论数 -1
  Article.updateOne({ _id: article }, { $inc: { commentNum: -1 } }).exec()

  //对应作者的评论数-1
  User.updateOne({ _id: from }, { $inc: { commentNum: -1 } }).exec()

})


module.exports = CommentSchema