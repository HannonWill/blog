const User = require('../models/user');

const Article = require('../models/article');

const Comment = require('../models/comment');

//跳转到发表文章页
exports.goArticlePage = async ctx => {
  await ctx.render("add-article", {
    title: "文章发表页",
    session: ctx.session
  })
}

//发表文章
exports.add = async ctx => {
  if (ctx.session.isNew) {
    //没登录 , 不需要查询数据库
    return ctx.body = {
      msg: "用户未登陆",
      status: 0
    }
  }
  //用户登录
  //这是发送过来的数据
  const data = ctx.request.body
  // title? content? tips? author?
  //添加文章作者
  data.author = ctx.session.uid

  await new Promise((resolve, reject) => {
    new Article(data).save((err, data) => {
      if (err) return reject(err)
      //更新用户文章计数
      User.update({ _id: data.author }, { $inc: { articleNum: 1 } }, err => {
        if (err) return console.log(err)
      })
      resolve(data)
    })
  }).then(data => {
    ctx.body = {
      msg: "发表成功",
      status: 1
    }
  }).catch(err => {
    ctx.body = {
      msg: "发表失败",
      status: 0
    }
  })


  //promise的形式
  /*   new Article(data)
      .save()
      .then(res => {
  
      })
   */



}

//获取文章列表
exports.getList = async (ctx) => {
  //每篇文章的作者的头像 
  //动态路由, 分页查找, 默认第一页
  let page = ctx.params.id || 1
  page--

  const maxNum = await Article.estimatedDocumentCount((err, num) => err ? console.log(err) : num)

  const artList = await Article
    .find()
    .sort("-created")
    .skip(3 * page)
    .limit(3)
    //拿到了5条数据 
    //mongoose用于连表查询
    .populate({
      path: "author",
      select: "username _id avatar"
    })
    .then(data => data)
    .catch(err => {
      console.log(err)
    })


  //exec()执行以上所有查询语句, 或者 .then 或者最后一个语句传回调
  //.exec(() => {})
  //ctx是同一个, 都有session
  await ctx.render("index", {
    title: "博客首页",
    session: ctx.session,
    artList,
    maxNum
  })
}

//文章详情
exports.details = async ctx => {
  //动态路由id
  const _id = ctx.params.id

  //文章本身的数据
  const article = await Article
    .findById(_id)
    .populate("author", "username")
    .then(data => data)

  //本篇文章的评论
  const comment = await Comment
    .find({ article: _id })
    .sort("-created")
    .populate("from", "username avatar")
    .then(data => data)
    .catch(err => {
      console.log(err)
    })

  await ctx.render("article", {
    title: article.title,
    session: ctx.session,
    article,
    comment
  })
}

//所有文章
exports.artlist = async ctx => {
  const uid = ctx.session.uid

  const data = await Article.find({ author: uid })

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}

//删除对应id的文章
exports.dele = async ctx => {
  const articleId = ctx.params.id
  const uid = ctx.session.uid
  //需要删除文章评论 
  //评论人的commentNum - 1 
  //用户的articleNum - 1
  let res = {
    state: 1,
    message: "删除成功"
  }

  await Article.findById(articleId)
    .then(data => data.remove())
    .catch(err => {
      if (err) {
        res = {
          state: 0,
          message: err
        }
      }
    })


  ctx.body = res
}