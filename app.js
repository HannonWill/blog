const Koa = require('koa');
//静态资源模块儿, 以设置的路径为静态资源的根路径
const static = require('koa-static');
//视图模块儿, 用来渲染各种文件
const views = require('koa-views');
const router = require('./routers/router');
//处理post的模块儿
const body = require('koa-body');
//日志模块儿
const logger = require('koa-logger');
//路径拼接
const { join } = require('path');
//后端session模块儿
const session = require('koa-session');


//生成koa实例 
const app = new Koa

//session 的配置对象
app.keys = ["wenhaonan"]
const CONFIG = {
  key: "Session_id",
  maxAge: 36e5,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true
}
//注册日志模块
app.use(logger())

//注册 session
app.use(session(CONFIG, app))

//配置静态资源目录
app.use(static(join(__dirname, "public")))

//配置视图模板
app.use(views(join(__dirname, "views"), {
  extension: "pug"
}))

//注册body, 处理用户post的数据请求
app.use(body())

//注册路由信息
app
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => {
  console.log("服务器启动成功, 监听在3000端口")
})

{
  // 创建管理员用户, 如何存在, 则返回 
  //admin admin
  const User = require('./models/user');
  const encrypt = require('./util/encrypt');

  User
    .find({ username: "admin" })
    .then(data => {
      if (data.length === 0) {
        //管理员不存在 
        const admin = new User({
          username: "admin",
          password: encrypt("admin"),
          role: 666,
          avatar: "/avatar/admin.jpg",
          commentNum: 0,
          articleNum: 0
        }, { versionKey: false })
        admin
          .save()
          .then(data => {
            console.log("管理员账户创建保存成功")
          })
          .catch(err => {
            if (err) return console.log(err)
          })
      } else {
        console.log("管理员账号存在: admin admin")
      }
    })
}
