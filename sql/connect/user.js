const connection = require('../config')

exports.getUserInfo = async (id) => {
  let sql = `select * from teacher where teacher_id=${id}`
  const result = await connection.getResult(sql)
  return result
}