/*自定义设置页面的根节点的大小开始*/
;(function() {
  var html = document.documentElement
  var hWidth = html.getBoundingClientRect().width
  html.style.fontSize = hWidth / 15 + 'px'
})()
/*自定义设置页面的根节点的大小结束*/
;(function() {
  $('html').on('touchmove', function(e) {
    e.preventDefault()
  })
})()

// 左边弹出菜单开始
;(function() {
  var menu = $('ul.menu')
  var masking = $('div.masking')
  var menuBtn = $('a.Menu')
  masking.on('click', function() {
    var left = -menu.width()
    masking.hide(0, function() {
      menu.animate({ left })
    })
  })

  menuBtn.on('click', function() {
    menu.animate({ left: 0 }, function() {
      masking.show()
    })
  })
  masking.on('touchmove', function(e) {
    e.preventDefault()
  })
  menu.on('touchmove', function(e) {
    e.preventDefault()
  })
})()
// 左边弹出菜单结束

//给元素添加Transition
function addTransition(obj, time) {
  var dur = 0.5
  if (time) {
    dur = time
  }
  obj.style.transition = 'all ' + dur + 's'
  obj.style.webkitTransition = 'all ' + dur + 's'
}
//给元素移除Transition

function removeTransition(obj) {
  obj.style.transition = ''
  obj.style.webkitTransition = ''
}
//给元素加动画
function setTransform(obj, dis, dir) {
  obj.style.transform = 'translate' + dir + '(' + dis + 'px)'
  obj.style.webkitTransform = 'translate' + dir + '(' + dis + 'px)'
}
//给元素加执行完后的回调函数
function addTransitionEnd(obj, fn) {
  obj.addEventListener('transitionEnd', fn)
  obj.addEventListener('webkitTransitionEnd', fn)
}

function showToast(message, callback) {
  $('.mask').css('display', 'block')
  $('.toast').fadeIn()
  $('.toast')
    .children()
    .html(message)
  clearTimeout(this.timer)
  this.timer = setTimeout(() => {
    $('.toast').fadeOut()
    $('.mask').css('display', 'none')
    if (callback) {
      callback()
    }
  }, 2000)
}
$('.mask').on('click', function(e) {
  e.preventDefault()
})
