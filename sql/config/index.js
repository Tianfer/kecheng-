const mysql = require('mysql')
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'python'
})

connection.getResult = async (sql) => {
  const res = {}
  await new Promise((resolve, reject) => {
    connection.query(sql, (err, result, field) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  }).then((data) => {
    res.code = 0
    res.data = data
  }).catch((err) => {
    res.code = 400
    res.msg = JSON.stringify(err)
  })
  return res
}



module.exports = connection