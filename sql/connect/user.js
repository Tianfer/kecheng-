const connection = require('../config')

exports.getUserInfo = async (id) => {
  let sql = `select name from teacher where teacher_id=${id}`
  const result = await connection.getResult(sql)
  console.log(result)
  return result
}