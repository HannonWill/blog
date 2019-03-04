const { db } = require('../schema/config');

const UserSchema = require('../schema/user');

//通过 db 对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema)

module.exports = User