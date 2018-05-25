const mysql = require('mysql')
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'ctf',
  password: 'c123456789tf',
  database: 'comment'
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