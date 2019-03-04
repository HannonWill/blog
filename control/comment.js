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