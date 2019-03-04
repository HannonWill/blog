const encrypt = require('../util/encrypt');
const User = require('../models/user');

//用户注册
exports.reg = async ctx => {
  // 用户注册时 post 发过来的数据
  const user = ctx.request.body
  const username = user.username
  const password = user.password
  //console.log(`用户名：${username}, 密码${password}`)
  //注册时应该干嘛， 假设格式符合规范
  //1. 去数据库user 查询 username 是否存在
  await new Promise((resolve, reject) => {
    //去数据库users 查询 username 是否存在
    User.find({ username }, (err, data) => {
      if (err) return reject(err)
      //查询数据库没出错？ 还有可能没有数据
      if (data.length !== 0) {
        //说明查询到数据  用户存在
        return resolve("")
      }
      //没有查询到数据  用户不存在 需要存到数据库  先加密 
      const _user = new User({
        username,
        password: encrypt(password),
        commentNum: 0,
        articleNum: 0
      })
      //保存到数据库
      _user.save((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

  })
    .then(async data => {
      if (data) {
        //注册成功
        await ctx.render("isOK", {
          status: "注册成功!"
        })
      } else {
        //用户名存在
        await ctx.render("isOK", {
          status: "用户名存在!"
        })
      }
    })
    .catch(async err => {
      await ctx.render("isOK", {
        status: "注册失败，请重试!"
      })

    })

}

//用户登录
exports.login = async ctx => {
  //拿到post数据 
  const user = ctx.request.body;
  const username = user.username;
  const password = user.password;

  await new Promise((resolve, reject) => {
    User.find({ username }, (err, data) => {
      if (err) return reject(err)
      if (data.length === 0) return reject("用户名不存在")
      //加密之后比对
      if (data[0].password == encrypt(password)) {
        //密码正确
        return resolve(data)
      }
      //密码不对
      resolve("")
    })
  }).then(async data => {
    if (!data) {
      //密码错误
      return ctx.render("isOK", {
        status: "密码错误，登录失败!"
      })
    }

    //让用户在他的cookie里设置username password（加密后的密码）
    ctx.cookies.set("username", encrypt(username), {
      //生效的域
      domain: "localhost",
      path: '/',
      maxAge: 36e5,
      //true 不让客户端访问这个cookie 
      httpOnly: true,
      overwrite: false,
      //是否签名, 不设置默认签名  false不签名
      signed: false
    })
    //用户在数据库中的的 _id 值
    ctx.cookies.set("uid", data[0]._id, {
      //生效的域
      domain: "localhost",
      path: '/',
      maxAge: 36e5,
      //true 不让客户端访问这个cookie 
      httpOnly: true,
      overwrite: false,
      //是否签名
      signed: false
    })

    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar,
      role: data[0].role
    }

    //登录成功
    ctx.redirect("/")

  })
    .catch(async err => {
      await ctx.render("isOK", {
        status: "登录失败，重新登录!" + err
      })
    })
}

//保持用户的状态
exports.keeplog = async (ctx, next) => {
  if (ctx.session.isNew) {
    //session 没有数据
    if (ctx.cookies.get("username")) {
      //没有session有cookie的情况， 认为是登录状态，更新session
      ctx.session = {
        username: ctx.cookies.get("username"),
        uid: ctx.cookies.get("uid"),
      }
    }
    //否则有session 认为是登录状态
  }
  await next()
}

//用户退出中间件
exports.logout = async ctx => {
  //清空session和cookies
  ctx.session = null
  ctx.cookies.set("username", null, {
    maxAge: 0
  })
  ctx.cookies.set("uid", null, {
    maxAge: 0
  })
  //在后台做重定向
  ctx.redirect("/")
}