const connection = require('../config')

exports.getCommentList = async (body) => {
  let where = ''
  if (body.key) {
    if (body.key === 'listen') {
      // const sql = `select * from comment where `
      // const result = await connection.getResult(sql)
    } else if (body.key === 'speak') {
      where = `where teacher_name=${connection.escape(body.val)}`
    } else if (body.key === 'rank') {
      where = `where count_grade=${connection.escape(body.val)}`
    }
  }

  const result1 = await connection.getResult(`select count(*) from comment ${where}`)
  const result2 = await connection.getResult(`select * from comment ${where} limit 10 offset ${(body.currentPage - 1) * 10}`)
  console.log(result1)
  console.log(result1.data[0]['count(*)'])
  console.log(result2)
  console.log(result2.data)
  if (result1.code !== 0) {
    return result1
  }
  if (result2.code !== 0) {
    return result2
  }
  return {
    code: 0,
    data: {
      count: result1.data[0]['count(*)'],
      list: result2.data
    }
  }
}

exports.delComment = async (body) => {
  let sql = `delete from comment where id=${body.id}`
  const result = await connection.getResult(sql)
  console.log(result)
  return result
}