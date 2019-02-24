const Router = require('koa-router');
const router = new Router

//设计主页  
router.get("/", async (ctx) => {
  //需要title属性
  await ctx.render('index', {
    session: {
      role: 666
    }
  })
})

module.exports = router