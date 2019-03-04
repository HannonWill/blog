const { Schema } = require("./config");

const UserSchema = new Schema({
  username: String,
  password: String,
  role: {
    type: String,
    //普通用户
    default: 1
  },
  avatar: {
    type: String,
    default: "/avatar/default.jpg"
  },
  articleNum: Number,
  commentNum: Number
}, { versionKey: false })

module.exports = UserSchema