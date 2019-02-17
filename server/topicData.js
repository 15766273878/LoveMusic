var mongoose = require('mongoose')
//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/musicData')
//创建表的规则
var topicSchema = new mongoose.Schema({
  topic: String,
  videoUrl: String,
  name: String,
  time: String
})
var topicDiscuss = new mongoose.Schema({
  topicId: String,
  text: String,
  username: String,
  time: String
})
//创建表
var topicData = mongoose.model('topicData', topicSchema)
var discussData = mongoose.model('topicDiscuss', topicDiscuss)

module.exports = {
  topicData,
  discussData
}
