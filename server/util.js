const searchUrl = 'http://songsearch.kugou.com/song_search_v2'
const searchParam = {
  userid: parseInt(Math.random() * 100),
  clientver: '',
  platform: 'WebFilter',
  tag: 'em',
  filter: '2',
  iscorrection: '1',
  privilege_filter: 0
}

const getMusicUrl =
  'http://www.kugou.com/yy/index.php?r=play/getdata&_=1497972864535'

module.exports = {
  searchUrl,
  searchParam,
  getMusicUrl
}
