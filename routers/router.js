const Router = require("koa-router");
//导入需要的控制的js
const user = require("../control/user");
const article = require("../control/article");
const comment = require('../control/comment');
const admin = require('../control/admin');

const router = new Router


//动态路由
//主要用来处理用户登录，注册，退出
// router.get("/user/:id", async (ctx) => {
//   ctx.body = ctx.params.will
// })

//主页路由 
router.get("/", user.keeplog, article.getList)

//注册登录
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
  const show = /reg$/.test(ctx.path)
  await ctx.render("register", { show })
})

//登录路由
router.post("/user/login", user.login)

//注册路由
router.post("/user/reg", user.reg)

//用户退出路由
router.get("/user/logout", user.logout)

//文章发表跳转
router.get("/article", user.keeplog, article.goArticlePage)

//文章添加
router.post("/article", user.keeplog, article.add)

//文章列表分页路由
router.get("/page/:id", article.getList)

//文章详情页路由
router.get("/article/:id", user.keeplog, article.details)

//发表评论
router.post("/comment", user.keeplog, comment.save)

//个人中心
router.get("/admin/:id", user.keeplog, admin.index)

//404页面
router.get("*", async ctx => {
  await ctx.render("404", {
    title: "404 Not Found"
  })
})

//导出router
module.exports = router