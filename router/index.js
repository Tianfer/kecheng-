const Router = require('koa-router')
const router = new Router()

const util = require('../wechat/util')
const paramsConfig = require('../config/params')
const wechat = require('../data/wechat')

const Course = require('../sql/connect/course')
const Manage = require('../sql/connect/manage')

// 接通微信服务器绑定校验
router.get('/wechatCheckout', (ctx) => {
  console.log('wechatCheckout')
  util.checkout(ctx)
})

// 测试获取微信获取At
router.get('/wechatAccessToken', async (ctx) => {
  console.log('wechatAccessToken')
  ctx.body = await util.getAt()
})

// 接收微信消息事件
router.post('/wechatCheckout', async (ctx) => {
  util.dealMsg(ctx)
})

// 自定义按钮
router.get('/defineMenu', async (ctx) => {
  console.log('defineMenu')
  ctx.body = await util.defineMenu()
})

// 评论页面
router.get('/comment', (ctx) => {
  console.log(ctx.request.querystring)
  ctx.redirect(`/html/comment.html?${ctx.request.querystring}`)
})

// 评论成功页面
router.get('/comment_success', (ctx) => {
  ctx.redirect('/html/comment_success.html')
})

// 管理界面
router.get('/manage', async (ctx) => {
  ctx.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${wechat.corpid}&agentid=${wechat.corpsecret}&redirect_uri=http://www.tianfer.top/manage/getUserInfo&state=web_login`)
})

router.get('/manage/getUserInfo', async (ctx) => {
  const params = ctx.request.querystring
  console.log(params)
  if (params.code) {
    const res = await util.getUserInfo()
    if (res.errcode === 0) {
      const userInfo = await User.getUserInfo(res.UserId)
      console.log(userInfo)
    } else {
      console.log('登录出错')
      console.log(res)
    }
  } else {
    console.log('取消登录')
  }
})

// 管理登录界面
router.get('/manage/login', async (ctx) => {
  ctx.redirect('/html/manage.html')
})

// 管理界面获取列表
router.post('/getCommentList', async (ctx) => {
  ctx.body = await Manage.getCommentList(ctx.request.body)
})

// 管理界面删除单个评论
router.post('/delComment', async (ctx) => {
  console.log(ctx.request.body)
  ctx.body = await Manage.delComment(ctx.request.body)
})

// 查课表页面
router.get('/course', (ctx) => {
  ctx.redirect('/html/course.html')
})

// 获取课程表信息
router.get('/getCourses', async (ctx) => {
  let res = {}
  const query = ctx.request.query
  const result = util.isParamsOk(query, paramsConfig.getCourses)
  if (result.code === 0) {
    res = await Course.getCourses(result.data)
  } else {
    res = result
  }
  ctx.body = res
})


// 获取单个课程信息
router.get('/getCourse/:id', async (ctx) => {
  let res = {}
  const params = ctx.params
  const result = util.isParamsOk(params, paramsConfig.getCourse)
  console.log(result)
  if (result.code === 0) {
    res = await Course.getCourse(result.data)
  } else {
    res = result
  }
  ctx.body = res
})

// 评论课程
router.post('/commentCourse', async (ctx) => {
  let res = {}
  const body = ctx.request.body
  const result = util.isParamsOk(body, paramsConfig.commentCourse, '[object Object]')
  if (result.code === 0) {
    res = await Course.commentCourse(result.data)
  } else {
    res = result
  }
  ctx.body = res
})

// 其他页面就404
router.get('*', async (ctx) => {
  // ctx.body = '404'
  // 微信扫码登录
  if (params.code) {
    const res = await util.getUserInfo()
    if (res.errcode === 0) {
      const userInfo = await User.getUserInfo(res.UserId)
      console.log(userInfo)
    } else {
      console.log('登录出错')
      console.log(res)
    }
  } else {
    console.log('取消登录')
  }
})

router.post('*', (ctx) => {
  ctx.body = {
    code: 404,
    msg: '未找到该请求'
  }
})

module.exports = router