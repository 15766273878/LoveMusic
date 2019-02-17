const express = require('express')
const xtpl = require('xtpl')
const bodyParser = require('body-parser')
const formidable = require('formidable')
const mongoose = require('mongoose')
const querystring = require('querystring')
const fs = require('fs')
const axios = require('axios')

const data = require('./server/djData')
const user = require('./server/user').user
const userInfo = require('./server/userInfo').userInfo
const { topicData, discussData } = require('./server/topicData')
const songsList = require('./server/songsList').songsList
const { searchUrl, searchParam, getMusicUrl } = require('./server/util')
const app = express()
const router = express.Router()
app.use(express.static('./static'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

//设置模板,会自动去views文件夹中查找.html
app.set('views', './views')
//设置当前视图引擎中的模板的扩展名.html
app.set('views engine', '.html')
//设置解析views/.html模板的方法xtpl.renderFile,它会自动代替res.render()方法，从而使得
//程序的扩展性变强
app.engine('html', xtpl.renderFile)

router.get('/', (req, res) => {
  djData = data.data
  topicData
    .find({}, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      let topicData = data
      res.render(
        'index.html',
        {
          topicData: topicData,
          djData
        },
        (err, content) => {
          if (err) {
            console.log(err)
            return
          }
          res.end(content)
        }
      )
    })
    .sort({
      _id: -1
    })
})

router.get('/index.html', (req, res) => {
  djData = data.data
  topicData
    .find({}, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      let topicData = data
      res.render(
        'index.html',
        {
          topicData: topicData,
          djData
        },
        (err, content) => {
          if (err) {
            console.log(err)
            return
          }
          res.end(content)
        }
      )
    })
    .sort({
      _id: -1
    })
})

router.get('/personal', (req, res) => {
  res.render('personal.html', (err, content) => {
    if (err) {
      console.log(err)
      return
    }
    res.end(content)
  })
})
router.get('/login.html', (req, res) => {
  res.render('login.html', (err, content) => {
    if (err) {
      console.log(err)
      return
    }
    res.end(content)
  })
})
router.get('/register.html', (req, res) => {
  res.render('register.html', (err, content) => {
    if (err) {
      console.log(err)
      return
    }
    res.end(content)
  })
})

router.get('/info.html', (req, res) => {
  userInfo.find(
    {
      username: req.query.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.render('info.html', data[0], (err, content) => {
        if (err) {
          console.log(err)
          return
        }
        res.end(content)
      })
    }
  )
})

router.get('/edit', (req, res) => {
  userInfo.find(
    {
      username: req.query.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.render('edit.html', data[0], (err, content) => {
        if (err) {
          console.log(err)
          return
        }
        res.end(content)
      })
    }
  )
})

router.get('/admin', (req, res) => {
  topicData
    .find({}, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.render(
        'admin.html',
        {
          topicData: data
        },
        (err, content) => {
          if (err) {
            console.log(err)
            return
          }
          res.end(content)
        }
      )
    })
    .sort({
      _id: -1
    })
})

router.get('/adminUser', (req, res) => {
  userInfo
    .find({}, (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.render(
        'adminUser.html',
        {
          data
        },
        (err, content) => {
          if (err) {
            console.log(err)
            return
          }
          res.end(content)
        }
      )
    })
    .sort({
      _id: -1
    })
})

router.post('/adminEdit', (req, res) => {
  if (req.body.method === 'del') {
    topicData.remove(
      {
        _id: req.body._id
      },
      err => {
        if (err) {
          console.log(err)
          return
        }
        res.send({
          success: true,
          msg: '删除成功!'
        })
      }
    )
  }
})

router.post('/resetPW', (req, res) => {
  user.update(
    {
      username: req.body.username
    },
    {
      $set: {
        password: '000000'
      }
    },
    function() {
      res.send({
        success: true,
        msg: '重置密码成功'
      })
    }
  )
})

// 评论页面的渲染开始
router.get('/topic', (req, res) => {
  topicData.find({ _id: req.query.topicId }, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    discussData
      .find({ topicId: req.query.topicId }, (err, discusses) => {
        if (err) {
          console.log(err)
          return
        }
        res.render(
          'topic.html',
          { topicData: data[0], discusses },
          (err, content) => {
            if (err) {
              console.log(err)
              return
            }
            res.end(content)
          }
        )
      })
      .sort({ _id: -1 })
  })
})
// 评论页面的渲染结束
// 登录注册部分开始
//处理注册逻辑
router.post('/register', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  user.find(
    {
      username: req.body.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        res.send({
          success: false,
          msg: '数据库错误'
        })
        return
      }
      if (data.length) {
        res.send({
          success: false,
          msg: '用户名已存在'
        })
        return
      }
      user.create(
        {
          username: req.body.username,
          password: req.body.password
        },
        (err, data) => {
          if (err) {
            console.log(err)
            res.send({
              success: false,
              msg: '注册失败'
            })
            return
          }
          res.send({
            success: true,
            msg: '注册成功'
          })
        }
      )
    }
  )
})
// 处理登录逻辑
router.post('/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  user.find(
    {
      username: req.body.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        res.send({
          success: false,
          msg: '数据库错误'
        })
        return
      }
      if (data.length) {
        if (
          data[0].username == req.body.username &&
          data[0].password == req.body.password
        ) {
          console.log(111)
          userInfo.find({ username: req.body.username }, (err, infos) => {
            if (err) {
              console.log(err)
              return
            }
            if (infos.length) {
              res.send({
                success: true,
                msg: '登录成功',
                info: true
              })
            } else {
              res.send({
                success: true,
                msg: '登录成功',
                info: false
              })
            }
          })
        } else {
          res.send({
            success: false,
            msg: '密码错误'
          })
        }
      } else {
        res.send({
          success: false,
          msg: '用户不存在'
        })
      }
    }
  )
})
// 登录注册部分结束

// 文件管理开始
app.post('/uploadImg', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  var form = new formidable.IncomingForm()
  form.uploadDir = './static/uploadImg/'
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    var data = fs.readFileSync(files.data.path)
    fs.appendFile('./static/uploadImg/' + fields.filename, data, err => {
      if (err) {
        console.log(err)
        res.send({
          success: false,
          msg: '上传失败'
        })
        return
      } else {
        fs.unlinkSync(files.data.path)
        res.send({
          success: true,
          msg: '上传成功',
          imgUrl: 'uploadImg/' + fields.filename
        })
      }
    })
  })
})

let output = []
let success = 0

app.post('/uploadVideo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  res.header('Content-Type', 'application/json;charset=utf-8')
  var form = new formidable.IncomingForm()
  form.uploadDir = './static/uploadVideo'
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (output.length == 0) {
      output = new Array(fields.total)
    }
    output[fields.index] = files.data

    success++
    console.log(success / fields.total * 100 + '%')
    if (success == fields.total) {
      function read(i) {
        var data = fs.readFileSync(output[i].path)
        fs.appendFileSync('./static/uploadVideo/' + fields.filename, data)
        fs.unlinkSync(output[i].path)
        i++
        if (i < success) {
          read(i)
        } else {
          success = 0
          output = []
          res.send({
            success: true,
            msg: '上传成功',
            videoUrl: 'uploadVideo/' + fields.filename
          })
          return
        }
      }
      read(0)
    }
  })
})
// 文件管理结束

//设置资料开始
router.post('/setInfo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  userInfo.find(
    {
      username: req.body.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        return
      } else {
        if (data.length) {
          userInfo.update(
            {
              username: req.body.username
            },
            {
              $set: {
                name: req.body.name,
                personality: req.body.personality,
                sex: req.body.sex,
                sculpture: req.body.sculpture,
                video: req.body.video
              }
            },
            function() {
              res.send({
                success: true,
                msg: '修改信息成功'
              })
            }
          )
        } else {
          userInfo.create(req.body, (err, data) => {
            if (err) {
              console.log(err)
              res.send({
                success: false,
                msg: '添加信息失败'
              })
              return
            }
            res.send({
              success: true,
              msg: '添加信息成功'
            })
          })
        }
      }
    }
  )
})
// 设置资料结束

//获取用户信息开始
router.post('/getINfo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  userInfo.find(
    {
      username: req.body.username
    },
    (err, data) => {
      if (err) {
        console.log(err)
        res.send({
          success: false,
          msg: '数据库错误'
        })
        return
      }
      res.send({
        success: true,
        msg: '登录成功',
        data
      })
    }
  )
})
// 获取用户信息结束

//发布动态开始
router.post('/topic', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  topicData.create(req.body, (err, data) => {
    if (err) {
      console.log(err)
      res.send({
        success: false,
        msg: '发布动态失败'
      })
      return
    }
    res.send({
      success: true,
      msg: '发布动态成功'
    })
  })
})
// 发布动态结束
//评论开始
router.post('/discuss', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  discussData.create(req.body, err => {
    if (err) {
      console.log(err)
      return
    }
    res.send({
      success: true,
      msg: '发表评论成功！'
    })
  })
})
// 评论结束
//搜索音乐开始
router.get('/searchMusic', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  searchParam.keyword = req.query.keyword
  searchParam.page = req.query.page
  searchParam.pagesize = req.query.pagesize
  axios
    .post(searchUrl, searchParam)
    .then(response => {
      res.send({ success: true, data: response.data.data })
    })
    .catch(function(error) {
      if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
})
// 搜索音乐结束

//获取音乐url开始
router.get('/getMusicUrl', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  axios
    .post(
      getMusicUrl +
        '&hash=' +
        req.query.hash +
        '&album_id=' +
        req.query.album_id
    )
    .then(response => {
      res.send({ success: true, data: response.data })
    })
    .catch(function(error) {
      if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
    })
})
// 获取音乐url结束

//收藏音乐开始
router.post('/markLove', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  songsList.find({ hash: req.body.hash }, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    if (data.length) {
      songsList.update(
        {
          hash: req.body.hash
        },
        {
          $set: {
            love: req.body.love
          }
        },
        function() {
          res.send({
            success: true,
            msg: '取消收藏成功'
          })
        }
      )
    } else {
      songsList.create(req.body, err => {
        if (err) {
          console.log(err)
          res.send({ success: false, msg: '数据库错误' })
          return
        }
        res.send({ success: true, msg: '收藏成功' })
      })
    }
  })
})
// 收藏音乐结束

// 获取收藏开始
router.post('/loveList', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  songsList.find({ username: req.body.username }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.send({ success: true, data, msg: '获取歌单成功' })
    }
  })
})
// 获取收藏结束

app.use('/', router)

app.listen(80, () => {
  console.log('服务开启成功：http://127.0.0.1')
})
