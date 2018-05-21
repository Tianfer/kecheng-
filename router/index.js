const Router = require('koa-router')
const router = new Router()

const util = require('../wechat/util')
const paramsConfig = require('../config/params')
const wechat = require('../data/wechat')

const Course = require('../sql/connect/course')
const Manage = require('../sql/connect/manage')

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
  if (ctx.cookies.get('name')) {
    ctx.redirect('/html/manage.html')
  } else {
    ctx.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${wechat.corpid}&agentid=${wechat.agentid}&redirect_uri=http%3A%2F%2Fwww.tianfer.top%2Fmanage%2FgetUserInfo&state=web_login`)
  }
})

router.get('/manage/getUserInfo', async (ctx) => {
  const query = ctx.request.query
  console.log(query)
  if (query.code) {
    const res = await util.getUserInfo()
    if (res.errcode === 0) {
      const userInfo = await User.getUserInfo(res.UserId)
      console.log(userInfo)
      // 设置cookie，过期时间为7天
      ctx.cookies.set('name', userInfo.name, {
        expires: new Date(Date.now() + 604800000)
      })
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
  ctx.body = '404'
})

router.post('*', (ctx) => {
  ctx.body = {
    code: 404,
    msg: '未找到该请求'
  }
})

module.exports = router