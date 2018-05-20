const connection = require('../config')

exports.getCommentList = async (body) => {
  if (Object.keys(body).length !== 0) {
    if (body.key === 'listen') {
      // const sql = `select * from comment where `
      // const result = await connection.getResult(sql)
    } else if (body.key === 'speak') {
      const sql = `select * from comment where teacher_name=${connection.escape(body.val)}`
      return await connection.getResult(sql)
    } else if (body.key === 'rank') {
      const sql = `select * from comment where count_grade=${connection.escape(body.val)}`
      return await connection.getResult(sql)
    }
  }

  return await connection.getResult('select * from comment')
}

exports.delComment = async (body) => {
  let sql = `delete from comment where id=${body.id}`
  const result = await connection.getResult(sql)
  console.log(result)
  return result
}