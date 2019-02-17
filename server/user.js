var mongoose = require('mongoose')
//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/musicData')
//创建表的规则
var userSchema = new mongoose.Schema({
  username: String,
  password: String
})
//创建表
var user = mongoose.model('user', userSchema)

module.exports = {
  user
}
