const User = require('../models/user');

const Article = require('../models/article');

const Comment = require('../models/comment');

//保存评论
exports.save = async ctx => {
  let message = {
    status: 0,
    msg: "登录才能评论"
  };
  //验证用户是否登录 
  if (ctx.session.isNew)
    return ctx.body = message;

  //用户登录了
  //拿到传过来的数据
  const data = ctx.request.body;
  data.from = ctx.session.uid;

  const _comment = new Comment(data);

  await _comment
    .save()
    .then(data => {
      message = {
        status: 1,
        msg: "评论成功"
      }
      //更新当前文章的评论计数器
      Article.update({ _id: data.article }, { $inc: { commentNum: 1 } }, err => {
        if (err) return console.log(err)
      })
      //跟新作者的评论数量
      User.update({ _id: data.from }, { $inc: { commentNum: 1 } }, err => {
        if (err) return console.log(err)
      })

    })
    .catch(err => {
      message = {
        status: 0,
        msg: "评论失败:" + err
      }
    })
  ctx.body = message
}

//后台：获取用户所有评论
exports.comlist = async ctx => {
  const uid = ctx.session.uid
  const data = await Comment.find({ from: uid }).populate("article", "title")

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}

//删除对应id的评论
exports.dele = async ctx => {
  const commentId = ctx.params.id

  let res = {
    state: 1,
    message: '删除成功'
  }
  //findby..and.. 直接在数据库操作，不会触发钩子
  // Comment.findByIdAndRemove(commentId).exec()
  //数据库的实例的方法，（静态方法） 同样不会触发
  // Comment.deleteOne({ _id: commentId }).exec()

  //钩子监听文档自身调用的方法 原型上的方法
  await Comment.findById(commentId)
    .then(data => data.remove())
    .catch(err => {
      res = {
        state: 0,
        message: err
      }
    })
  // new Comment({}).remove()
  ctx.body = res
}