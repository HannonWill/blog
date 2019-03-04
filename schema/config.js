const mongoose = require('mongoose');
db = mongoose.createConnection("mongodb://localhost:27017/blog", {
  useNewUrlParser: true
})

//原生promise 代替 mongoose 的promise
mongoose.Promise = global.Promise

//把mongoose的schema取出来
const { Schema } = mongoose

db.on('error', () => {
  console.log("连接数据库失败!")
})

db.on("open", () => {
  console.log("blogproject 数据库连接成功!")
})
module.exports = {
  db,
  Schema
} 