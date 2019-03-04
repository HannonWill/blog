const { db } = require("../schema/config");

const ArticleSchema = require("../schema/article");

//通过 db 对象创建操作 article 数据库的模型对象
const Article = db.model("articles", ArticleSchema)


module.exports = Article