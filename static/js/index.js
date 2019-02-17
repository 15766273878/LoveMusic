// 本地存储歌单
let songsList = []
let songsIndex = 0
// 进入搜索部分和退出开始
$('a.Search').on('click', function() {
  $('.nav').css('display', 'none')
  $('.swiper-box').css('display', 'none')
  $('div.search').css('display', 'flex')
  $('.list').css('display', 'block')
})

$('div.search form .back').on('click', function() {
  $('.nav').css('display', 'flex')
  $('.swiper-box').css('display', 'block')
  $('div.search').css('display', 'none')
  $('.list').css('display', 'none')
})
// 进入搜索部分和退出结束

/*滑动插件开始*/
;(function() {
  var btns = $('div.nav a.iconfont')
  var swiper = $('div.swiper')[0]

  swiper.current = 1

  slider(swiper, btns)
  //头部nav切换开始
  btns.each(function(i, e) {
    this.index = i
  })
  btns.on('click', function() {
    $('div.nav a.iconfont').removeClass('active')
    $(this).addClass('active')
    var that = this
    var width = swiper.children[0].offsetWidth
    var left = -this.index * width
    swiper.current = that.index
    addTransition(swiper)
    setTransform(swiper, left, 'x')
    addTransitionEnd(swiper, function() {
      removeTransition(swiper)
    })
  })

  //头部nav切换结束

  // /**
  //  * 手机端滑动插件
  //  * @param obj   需要被滑动的内块目标
  //  * @param dots  滑动后校准的圆点集合(默认jquery对象)
  //  */
  // function slider(obj, dots) {
  //   var objParent = obj.parentNode
  //   var objChildWidth = $(obj).children()[0].offsetWidth

  //   setTransform(obj, -swiper.current * objChildWidth, 'x')

  //   addTransitionEnd(obj, function() {
  //     removeTransition(obj)
  //   })

  //   objParent.addEventListener('touchstart', function(e) {
  //     obj.startX = e.touches[0].pageX
  //     obj.isMove = false
  //   })
  //   objParent.addEventListener('touchmove', function(e) {
  //     obj.isMove = true
  //     obj.endX = e.touches[0].pageX
  //     obj.distance = obj.endX - obj.startX
  //     removeTransition(obj)
  //     if (swiper.current > 0 && swiper.current < obj.children.length - 1) {
  //       setTransform(obj, -swiper.current * objChildWidth + obj.distance, 'x')
  //     }
  //   })
  //   objParent.addEventListener('touchend', function() {
  //     if (obj.isMove) {
  //       if (Math.abs(obj.distance) > objChildWidth / 3) {
  //         if (obj.distance > 0 && swiper.current >= 1) {
  //           swiper.current--
  //         } else if (
  //           obj.distance < 0 &&
  //           swiper.current <= obj.children.length - 2
  //         ) {
  //           swiper.current++
  //         }
  //         addTransition(obj)
  //         setTransform(obj, -swiper.current * objChildWidth, 'x')
  //       } else {
  //         addTransition(obj)
  //         setTransform(obj, -swiper.current * objChildWidth, 'x')
  //       }
  //     }
  //     updateDot()
  //   })

  //   function updateDot() {
  //     dots.removeClass('active')
  //     $(dots[swiper.current]).addClass('active')
  //   }
  // }
})()
/*滑动插件结束*/

/*onload的时候获取轮播图等歌单信息开始 */
window.onload = function() {
  let swiperWidth = -$('.swiper>div')[0].offsetWidth
  $('.swiper').css('transform', 'translateX(' + swiperWidth + 'px)')
  // 调用轮播图插件
  slider()
  //如果用户已登录就获取用户信息
  if (sessionStorage.getItem('user')) {
    $.ajax({
      url: 'http://127.0.0.1/getInfo',
      type: 'post',
      data: {
        username: sessionStorage.getItem('user')
      },
      dataType: 'json',
      success: function(rs) {
        const data = rs.data[0]
        $('.sculpture img')[0].src = data.sculpture
        $('.name').html(data.name)
      },
      error: function(err) {
        console.log(err)
      }
    })
    //获取收藏的歌单开始
    getLoveList(function(rs) {
      for (let i = 0; i < rs.data.length; i++) {
        delete rs.data[i]['username']
        songsList.push(rs.data[i])
      }
      musicPlayer(songsList[0], false)
      initSongsList(songsList)
      let ul = document.createElement('ul')
      for (let i = 0; i < songsList.length; i++) {
        let li = document.createElement('li')
        li.dataset.index = i
        if (songsList[i].love) {
          li.className = 'love'
        }
        li.innerHTML = songsList[i].audio_name
        ul.appendChild(li)
      }
      $('.myMusic div div').html(ul)
    })
  }
}

/*轮播图部分开始*/
function slider() {
  var imgUl = document.querySelector('.imgUl')
  var imgBox = imgUl.parentNode
  var li_width = imgUl.children[0].offsetWidth
  var dots = document.querySelector('.slide-list').children
  var current = 1
  setTransform(imgUl, -current * li_width, 'x')
  imgUl.timeInterval = 5000
  clearInterval(imgUl.timer)
  imgUl.timer = setInterval(function() {
    current++
    addTransition(imgUl)
    var dis = -current * li_width
    setTransform(imgUl, dis, 'x')
  }, imgUl.timeInterval)

  addTransitionEnd(imgUl, function() {
    if (current >= imgUl.children.length - 1) {
      current = 1
    } else if (current == 0) {
      current = imgUl.children.length - 2
    }
    removeTransition(imgUl)
    setTransform(imgUl, -current * li_width, 'x')
    updateDot()
  })

  imgBox.addEventListener('touchstart', function(e) {
    clearInterval(imgUl.timer)
    imgUl.startX = e.touches[0].pageX
    imgUl.isMove = false
  })
  imgBox.addEventListener('touchmove', function(e) {
    e.stopPropagation()
    imgUl.isMove = true
    imgUl.endX = e.touches[0].pageX
    imgUl.distance = imgUl.endX - imgUl.startX
    removeTransition(imgUl)
    setTransform(imgUl, -current * li_width + imgUl.distance, 'x')
  })
  imgBox.addEventListener('touchend', function() {
    if (imgUl.isMove) {
      if (Math.abs(imgUl.distance) > li_width / 3) {
        if (imgUl.distance > 0 && current >= 1) {
          current--
        } else if (imgUl.distance < 0 && current <= imgUl.children.length - 2) {
          current++
        }
        addTransition(imgUl)
        setTransform(imgUl, -current * li_width, 'x')
      } else {
        addTransition(imgUl)
        setTransform(imgUl, -current * li_width, 'x')
      }
    }
    clearInterval(imgUl.timer)
    imgUl.timer = setInterval(function() {
      current++
      addTransition(imgUl)
      var dis = -current * li_width
      setTransform(imgUl, dis, 'x')
    }, imgUl.timeInterval)
    updateDot()
  })

  function updateDot() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = ''
    }
    dots[current - 1].className = 'active'
  }
} /*轮播图部分结束*/
/*onload的时候获取轮播图等歌单信息开始*/

//搜索部分开始
;(function() {
  const searchInput = $('.search input')
  const searchBtn = $('.search span.icon-sousuo')
  const songList = $('.list')

  searchInput.on('keydown', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      searchMusic()
    }
  })
  searchBtn.on('click', function() {
    searchMusic()
  })

  function searchMusic() {
    const keyword = searchInput[0].value
    $.ajax({
      url: 'http://127.0.0.1/searchMusic',
      type: 'get',
      data: {
        keyword,
        page: 1,
        pagesize: 15
      },
      dataType: 'json',
      success: function(rs) {
        songList.html()
        const data = rs.data
        for (let i = 0; i < data.lists.length; i++) {
          const str = data.lists[i].SingerName
          const nameStr = data.lists[i].SongName
          if (str.indexOf('<em>') !== -1 && str.indexOf('<em>') !== '-1') {
            let formatStr =
              str.slice(0, str.indexOf('<em>')) +
              str.slice(str.indexOf('<em>') + 4, str.indexOf('</em>')) +
              str.slice(str.indexOf('</em>') + 5)
            data.lists[i].SingerName = formatStr
          } else if (
            nameStr.indexOf('<em>') !== -1 &&
            nameStr.indexOf('<em>') !== '-1'
          ) {
            let formatName =
              nameStr.slice(0, nameStr.indexOf('<em>')) +
              nameStr.slice(
                nameStr.indexOf('<em>') + 4,
                nameStr.lastIndexOf('</em>')
              ) +
              nameStr.slice(nameStr.indexOf('</em>') + 5)
            data.lists[i].SongName = formatName
          }
        }
        const html = template('searchResult', data)
        songList.html(html)
      },
      error: function(err) {
        console.log(2)
        console.log(err)
      }
    })
  }
})()
// 搜索部分结束

// 个人信息跳转
//获取音乐url开始
function playMusic(hash, album_id) {
  $.ajax({
    url: 'http://127.0.0.1/getMusicUrl',
    type: 'get',
    data: {
      hash,
      album_id
    },
    success: function(rs) {
      const data = rs.data.data
      //添加进入歌单开始
      this.addList = true
      for (let i = 0; i < songsList.length; i++) {
        if (songsList[i].hash === data.hash) {
          this.addList = false
        }
      }
      if (this.addList) {
        songsList.push(data)
        songsIndex = songsList.length - 1
        initSongsList(songsList)
      }
      // 添加进入歌单结束
      musicPlayer(data, true)
    },
    error: function(err) {
      console.log(err)
    }
  })
}
// 获取音乐url开始结束
function initSongsList(songsList) {
  let ul = document.createElement('ul')
  for (let i = 0; i < songsList.length; i++) {
    let li = document.createElement('li')
    li.dataset.index = i
    if (songsList[i].love) {
      li.className = 'love'
    }
    li.innerHTML = songsList[i].audio_name
    ul.appendChild(li)
  }
  $('.songsList').html(ul)
}
//播放音乐开始
function musicPlayer(data, autoplay) {
  let lyricsArr = []
  if (data) {
    lyricsArr = initLyrics(data.lyrics)
  }
  $('.lyrics div').html(function() {
    const ul = document.createElement('ul')
    for (let i = 0; i < lyricsArr.length; i++) {
      const li = document.createElement('li')
      li.innerHTML = lyricsArr[i][1]
      ul.appendChild(li)
    }
    return ul
  })
  if (data) {
    if (data.love) {
      $('#markLove').addClass('loveT')
      $('#markLove').removeClass('loveF')
    } else {
      $('#markLove').removeClass('loveT')
      $('#markLove').addClass('loveF')
    }
    $('#music')[0].src = data.play_url
    if (autoplay) {
      $('#music')[0].play()
      $('#playBtn').removeClass('playing')
      $('#playBtn').addClass('pausing')
      $('#detail-play').removeClass('playing')
      $('#detail-play').addClass('pausing')
      $('#song-cover').addClass('rotateTarget')
    }
    $('#song-cover img')[0].src = data.img
    $('.song-info h4')[0].innerText = data.author_name
    $('.song-info h5')[0].innerText = data.audio_name
    //player的内容
    $('.playerDetail h1').html(data.song_name)
    $('.playerDetail h3').html(data.author_name)
    $('.playerDetail #download')[0].download = data.audio_name
    $('.playerDetail #download')[0].href = data.play_url
    $('.playerDetail .lyrics img')[0].src = data.img
  }
}
$('.lyrics').on('click', function() {
  this.isClick = !this.isClick
  if (this.isClick) {
    $('.lyrics img').css('display', 'none')
  } else {
    $('.lyrics img').css('display', 'block')
  }
})
$('.songsList').on('click', function(e) {
  musicPlayer(songsList[e.target.dataset.index], true)
  $('.songsList').animate({
    right: '-7rem'
  })
})

$('.myMusic').on('click', function(e) {
  musicPlayer(songsList[e.target.dataset.index], true)
})
//播放音乐结束

// 播放暂停开始
$('#playBtn').on('click', function(e) {
  e.stopPropagation()
  if ($(this).hasClass('playing')) {
    $(this).removeClass('playing')
    $(this).addClass('pausing')
    $('#detail-play').removeClass('playing')
    $('#detail-play').addClass('pausing')
    $('#music')[0].play()
    $('#song-cover').addClass('rotateTarget')
  } else {
    $(this).removeClass('pausing')
    $(this).addClass('playing')
    $('#detail-play').removeClass('pausing')
    $('#detail-play').addClass('playing')
    $('#music')[0].pause()
    $('#song-cover').removeClass('rotateTarget')
  }
})
$('#detail-play').on('click', function() {
  if ($(this).hasClass('playing')) {
    $(this).removeClass('playing')
    $(this).addClass('pausing')
    $('#playBtn').removeClass('playing')
    $('#playBtn').addClass('pausing')
    $('#music')[0].play()
    $('#song-cover').addClass('rotateTarget')
  } else {
    $(this).removeClass('pausing')
    $(this).addClass('playing')
    $('#playBtn').removeClass('pausing')
    $('#playBtn').addClass('playing')
    $('#music')[0].pause()
    $('#song-cover').removeClass('rotateTarget')
  }
})
// 播放暂停结束

// 打开查看歌词和收藏开始
$('.playBar').on('click', function() {
  $('.playerDetail').animate({
    top: 0
  })
})
$('.playerDetail .icon-htmal5icon39').on('click', function() {
  $('.playerDetail').animate({
    top: '100vh'
  })
})

// 打开查看歌词和收藏结束

// 标为喜欢开始
$('#markLove').on('click', function() {
  if (sessionStorage.getItem('user')) {
    if ($(this).hasClass('loveF')) {
      $(this).removeClass('loveF')
      $(this).addClass('loveT')
      for (let i = 0; i < songsList.length; i++) {
        if (songsList[i].play_url === $('#music')[0].src) {
          $('.songsList ul li')
            .eq(i)
            .addClass('love')
          songsList[i].love = true
          $.ajax({
            url: 'http://127.0.0.1/markLove',
            type: 'post',
            dataType: 'json',
            data: {
              username: sessionStorage.getItem('user'),
              ...songsList[i],
              love: true
            },
            success: function(rs) {},
            error: function(err) {
              console.log(err)
            }
          })
          return
        }
      }
      showToast('收藏成功！')
    } else {
      $(this).removeClass('loveT')
      $(this).addClass('loveF')
      for (let i = 0; i < songsList.length; i++) {
        if (songsList[i].play_url === $('#music')[0].src) {
          $('.songsList ul li')
            .eq(i)
            .removeClass('love')
          songsList[i].love = false
          $.ajax({
            url: 'http://127.0.0.1/markLove',
            type: 'post',
            dataType: 'json',
            data: {
              username: sessionStorage.getItem('user'),
              ...songsList[i],
              love: false
            },
            success: function(rs) {
              if (rs.success) {
                showToast('取消收藏成功！')
              } else {
                showToast(rs.msg)
              }
            },
            error: function(err) {
              console.log(err)
            }
          })
          return
        }
      }
    }
  } else {
    showToast('要登录才能收藏哦')
  }
})
// 标记为喜欢结束

// 查看喜欢歌单开始
function getLoveList(callback) {
  if (sessionStorage.getItem('user')) {
    $.ajax({
      url: 'http://127.0.0.1/loveList',
      type: 'post',
      dataType: 'json',
      data: {
        username: sessionStorage.getItem('user')
      },
      success: function(rs) {
        callback(rs)
      },
      error: function(err) {
        console.log(err)
      }
    })
  } else {
    showToast('您还未登录哦')
  }
}
// 查看喜欢歌单结束
;(function() {
  $('.sculpture').click(function() {
    if (sessionStorage.getItem('user')) {
      window.location.href =
        'info.html?username=' + sessionStorage.getItem('user')
    } else {
      window.location.href = 'login.html'
    }
  })
  $('li.option:nth-child(4)').click(function() {
    if (sessionStorage.getItem('user')) {
      window.location.href =
        'info.html?username=' + sessionStorage.getItem('user')
    } else {
      window.location.href = 'login.html'
    }
  })
})()

//注销开始
$('.singOut').click(function() {
  sessionStorage.clear()
  window.location.reload()
}) // 发布动态开始
$('.topicSend').click(function() {
  if (sessionStorage.getItem('user')) {
    if ($('.loading').css('display') === 'block') {
      showToast('请等待视频上传完毕再发布')
    } else {
      const topic = $('.weui-uploader__bd textarea')[0].value
      let videoUrl = $('.weui-uploader__file video')[0].src
      if (videoUrl.lastIndexOf('/') + 1 === videoUrl.length) {
        videoUrl = ''
      }
      if (!videoUrl && !topic) {
        showToast('亲,你不能啥信息都不填就发动态哦')
        return
      }
      const name = $('.name')[0].innerText
      let date = new Date()
      time = `${date.getFullYear()}/${
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1)
      }/${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()} ${
        date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      }:${
        date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      }:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`
      $.post(
        'http://127.0.0.1/topic',
        {
          topic,
          videoUrl,
          name,
          time
        },
        res => {
          if (res.success) {
            window.location.reload()
          } else {
            showToast('网络错误！')
          }
        }
      )
    }
  } else {
    showToast('您还未登录')
  }
})
// 播放视频开始
$('.icon-bofang').click(function() {
  const video = this.previousElementSibling
  video.src = video.dataset.url
  video.autoplay = 'autoplay'
  video.controls = 'controls'
  this.style.display = 'none'
})
// 播放视频结束
// 上传视频开始
$('#uploaderInput').on('change', function() {
  $('.loading').css('display', 'block')
  const file = this.files[0]
  if (file) {
    var size = file.size
    var name = file.name
    var shareSize = 2 * 1024 * 1024
    var total = Math.ceil(size / shareSize)
    var success = 0
    for (var i = 0; i < total; i++) {
      var start = i * shareSize
      var end = (i + 1) * shareSize > size ? size : (i + 1) * shareSize

      var formData = new FormData()
      formData.append('filename', name)
      formData.append('total', total)
      formData.append('index', i)
      formData.append('data', file.slice(start, end))

      var xhr = new XMLHttpRequest()
      xhr.open('post', 'http://127.0.0.1/uploadVideo')
      xhr.send(formData)
      $('.js_progress').css('width', '0')
      xhr.onload = function() {
        success++
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const data = JSON.parse(xhr.responseText)
          if (data.success) {
            $('.weui-uploader__file video')[0].src = data.videoUrl
            $('.weui-uploader__file').css('display', 'block')
            $('.loading').css('display', 'none')
          } else {
            showToast('网络错误！')
          }
        }
      }
    }
  }
})

//打开歌单开始
$('#download')[0].nextElementSibling.onclick = function() {
  if ($('.songsList').css('right') === '0px') {
    $('.songsList').animate({
      right: '-7rem'
    })
  } else {
    $('.songsList').animate({
      right: 0
    })
  }
}
$('#playList').on('click', function(e) {
  e.stopPropagation()
  if ($('.songsList').css('right') === '0px') {
    $('.songsList').animate({
      right: '-7rem'
    })
  } else {
    $('.songsList').animate({
      right: 0
    })
  }
})
// 打开歌单结束

// 上一首和下一首开始
$('.preSong').on('click', function() {
  songsIndex--
  if (songsIndex === 0) {
    songsIndex = songsList.length - 1
  }
  musicPlayer(songsList[songsIndex], true)
})

$('.nextSong').on('click', function() {
  songsIndex++
  if (songsIndex === songsList.length - 1) {
    songsIndex = 0
  }
  musicPlayer(songsList[songsIndex], true)
})
// 上一首和下一首结束

//自动获取audio播放时间
const ProgreeTimer = setInterval(function() {
  const duration = $('#music')[0].duration
  const buffered = $('#music')[0].buffered.length
  const currentTime = $('#music')[0].currentTime
  const time =
    parseInt(duration / 60) +
    ':' +
    (duration % 60 > 9
      ? parseInt(duration % 60)
      : '0' + parseInt(duration % 60))
  const currentT =
    (currentTime / 60 > 9
      ? currentTime / 60
      : '0' + parseInt(currentTime / 60)) +
    ':' +
    (currentTime % 60 >= 10
      ? (currentTime % 60).toFixed(2)
      : '0' + (currentTime % 60).toFixed(2))
  $('.progress .circle').css('left', currentTime / duration * 100 + '%')
  $('.progress .buffered').css('width', buffered / 1 * 100 + '%')
  $('.progress .current').css('width', currentTime / duration * 100 + '%')
  if (duration == currentTime) {
    if (songsIndex === songsList.length - 1) {
      songsIndex = 0
    } else {
      songsIndex++
    }
    musicPlayer(songsList[songsIndex], true)
  }
}, 500)
// 自动获取audio播放时间

// 初始化歌词开始
function initLyrics(text) {
  //将文本分隔成一行一行，存入数组
  var lines = text.split('\n'),
    //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
    //保存最终结果的数组
    result = []
  //去掉不含时间的行
  while (!pattern.test(lines[0])) {
    lineslines = lines.slice(1)
  }
  //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
  lines[lines.length - 1].length === 0 && lines.pop()
  lines.forEach(function(v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
    //提取出时间[xx:xx.xx]
    var time = v.match(pattern)
    //提取歌词
    var value = v.replace(pattern, '')
    //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
    time.forEach(function(v1, i1, a1) {
      //去掉时间里的中括号得到xx:xx.xx
      var t = v1.slice(1, -1).split(':')
      //将结果压入最终数组
      result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
    })
  })
  //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
  result.sort(function(a, b) {
    return a[0] - b[0]
  })
  return result
}
// 初始化歌词结束
// 发布动态结束
// 滚动歌单开始
var songsListMove = $('.songsList')[0]
songsListMove.addEventListener('touchstart', function(e) {
  songsListMove.startY = e.touches[0].pageY
  songsListMove.currentT = $('.songsList ul')[0].offsetTop
})
songsListMove.addEventListener('touchmove', function(e) {
  e.stopPropagation()
  e.preventDefault()
  songsListMove.endY = e.touches[0].pageY
  songsListMove.distance = songsListMove.endY - songsListMove.startY
  if (
    $('.songsList ul')[0].offsetTop <= 0 &&
    $('.songsList ul')[0].offsetHeight -
      songsListMove.offsetHeight +
      $('.songsList ul')[0].offsetTop >=
      0
  )
    $('.songsList ul').css(
      'top',
      songsListMove.currentT + songsListMove.distance + 'px'
    )
})
songsListMove.addEventListener('touchend', function(e) {
  songsListMove.startY = 0
  if ($('.songsList ul')[0].offsetHeight - songsListMove.offsetHeight > 0) {
    if ($('.songsList ul')[0].offsetTop > 0) {
      $('.songsList ul').css('top', 0)
    } else if (
      $('.songsList ul')[0].offsetHeight -
        songsListMove.offsetHeight +
        $('.songsList ul')[0].offsetTop <
      0
    ) {
      $('.songsList ul').css(
        'top',
        songsListMove.offsetHeight - $('.songsList ul')[0].offsetHeight
      )
    }
  }
})
// 滚动歌单结束

// 滚动歌词开始
var lyricsMove = $('.lyrics')[0]
lyricsMove.addEventListener('touchstart', function(e) {
  lyricsMove.startY = e.touches[0].pageY
  lyricsMove.currentT = $('.lyrics ul')[0].offsetTop
})
lyricsMove.addEventListener('touchmove', function(e) {
  e.stopPropagation()
  e.preventDefault()
  lyricsMove.endY = e.touches[0].pageY
  lyricsMove.distance = lyricsMove.endY - lyricsMove.startY
  if (
    $('.lyrics ul')[0].offsetTop <= 0 &&
    $('.lyrics ul')[0].offsetHeight -
      lyricsMove.offsetHeight +
      $('.lyrics ul')[0].offsetTop >=
      0
  )
    $('.lyrics ul').css('top', lyricsMove.currentT + lyricsMove.distance + 'px')
})
lyricsMove.addEventListener('touchend', function(e) {
  lyricsMove.startY = 0
  if ($('.lyrics ul')[0].offsetHeight - lyricsMove.offsetHeight > 0) {
    if ($('.lyrics ul')[0].offsetTop > 0) {
      $('.lyrics ul').css('top', 0)
    } else if (
      $('.lyrics ul')[0].offsetHeight -
        lyricsMove.offsetHeight +
        $('.lyrics ul')[0].offsetTop <
      0
    ) {
      $('.lyrics ul').css(
        'top',
        lyricsMove.offsetHeight - $('.lyrics ul')[0].offsetHeight
      )
    }
  }
})

$('.playerDetail')[0].addEventListener('touchmove', function(e) {
  e.preventDefault()
})
// 滚动歌词结束
$('.progress').on('click', function(e) {
  const left = e.pageX - this.offsetLeft
  $('.progress .circle').css('left', left)
  $('.progress .current').css('width', left / this.offsetWidth * 100 + '%')
  $('#music')[0].currentTime = left / this.offsetWidth * $('#music')[0].duration
})
