var mongoose = require('mongoose')
//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/musicData')
//创建表的规则
var songsListSchema = new mongoose.Schema({
  username: String,
  album_id: String,
  album_name: String,
  audio_name: String,
  author_id: String,
  author_name: String,
  authors: Array,
  bitrate: String,
  filesize: String,
  hash: String,
  have_album: String,
  have_mv: String,
  img: String,
  lyrics: String,
  play_url: String,
  privilege: Array,
  privilege2: String,
  song_name: String,
  timelength: String,
  video_id: String,
  love: Boolean
})
//创建表
var songsList = mongoose.model('songsList', songsListSchema)

module.exports = {
  songsList
}
