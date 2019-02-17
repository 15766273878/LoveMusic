var mongoose = require('mongoose')
//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/musicData')
//创建表的规则
var userSchema = new mongoose.Schema({
  username: String,
  name: String,
  personality: String,
  sex: String,
  sculpture: String
})
//创建表
var userInfo = mongoose.model('userInfo', userSchema)

module.exports = {
  userInfo
}
