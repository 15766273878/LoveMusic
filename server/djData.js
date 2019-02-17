const axios = require('axios')
const querystring = require('querystring')

const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
let params = {
  g_tk: 5381,
  uin: 0,
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform: 'h5',
  needNewCode: 1
}
let data = {}
params = querystring.stringify(params)
axios.get(url, params).then(response => {
  data.data = response.data.data
  data.code = response.data.code
})
module.exports = data
