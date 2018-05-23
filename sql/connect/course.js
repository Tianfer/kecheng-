const connection = require('../config')
const paramsConfig = require('../../config/params')

exports.getCourses = async (body) => {
  let sql = ''
  if (body.building === '全部教学楼') {
    sql = `
      select * from year_17_18
      where week=${connection.escape(body.week)}
      and day=${connection.escape(body.day)}
    `
  } else {
    sql = `
      select * from year_17_18
      where building=${connection.escape(body.building)}
      and week=${connection.escape(body.week)}
      and day=${connection.escape(body.day)}
    `
  }
  const result = await connection.getResult(sql)
  if (result.code === 0) {
    const data = {
      '1-2': [],
      '3-4': [],
      '5-6': [],
      '7-8': [],
      '9-10': []
    }
    result.data.map((item) => {
      const arr = item.time.split('')
      data[`${arr[1]}-${++arr[1]}`].push(item)
    })
    result.data = data
  }
  return result
}

exports.commentCourse = async (body, user) => {
  const arrKey = Object.keys(paramsConfig.commentCourse)
  const arrVal = []
  arrKey.map((key) => {
    arrVal.push(connection.escape(body[key]))
  })
  const sql = `
    insert into comment
    (${arrKey.join(', ')}, comment_teacher_id, comment_teacher_name, imgs, other_advise, created_at, updated_at)
    values
    (${arrVal.join(', ')}, '${user.teacher_id}', '${user.name}', ${connection.escape(body.imgs)}, ${connection.escape(body.other_advise)}, ${Date.now()}, ${Date.now()})
  `
  return connection.getResult(sql)
}

exports.getCourse = async (body) => {
  const sql = `select * from year_17_18 where id = ${body.id}`
  const result = await connection.getResult(sql)
  if (result.code === 0) {
    result.data = result.data[0]
  }
  return result
}