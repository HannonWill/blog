const User = require('../models/user');

const Article = require('../models/article');

const Comment = require('../models/comment');

const fs = require('fs');

const { join } = require('path');
//跳转
exports.index = async ctx => {
  //用户未登陆返回404
  if (ctx.session.isNew) {
    ctx.status = 404
    return await ctx.render("404", { title: "404" })
  }
  //动态路由
  const _id = ctx.params.id

  //本地有的admin的文件数组
  const arr = fs.readdirSync(join(__dirname, "../views/admin"))

  let flag = false
  //去除admin
  arr.forEach(v => {
    const name = v.replace(/^(admin[-]?)|(\.pug)$/g, "")
    if (name == _id) {
      flag = true
    }
  })

  if (flag) {
    //输入有效
    await ctx.render("admin/admin-" + _id, {
      role: ctx.session.role
    })
  } else {
    //输入无效
    return await ctx.render("404", { title: "404" })
  }
};