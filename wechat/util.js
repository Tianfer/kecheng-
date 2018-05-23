const https = require('https')
const fs = require('fs')
const sha1 = require('sha1')

const config = require('../data/wechat.js')

const getLocalAtInfo = async () => {
  let AtExpired = true
  let wechat = {}
  await new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/wechat.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  }).then((data) => {
    if (Date.now() < data.lastTime + data.expires_in * 1000) {
      AtExpired = false
      wechat = data
    }
  }).catch((err) => {
    console.log('something error')
    console.log(err)
  })
  return { AtExpired , wechat }
}

const getAt = async () => {
  const info = await getLocalAtInfo()
  if (info.AtExpired) {
    console.log('I get a new At')
    await new Promise((resolve, reject) => {
      const app_id = config.app_id
      const app_secret = config.app_secret
      https.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpid}&corpsecret=${config.corpsecret}`, res => {
        res.on('data', (data) => {
          resolve(data)
        })
      })
    }).then((data) => {
      data = data.toString()
      info.wechat = data = JSON.parse(data.toString())
      saveAt(data)
    }).catch((err) => {
      console.log('getAt error')
      console.log(err)
    })
  }

  return info.wechat.access_token
}

const saveAt = (data) => {
  data.lastTime = Date.now()
  fs.writeFile(`${__dirname}/wechat.json`, JSON.stringify(data), 'utf8', (err, data) => {
    if (err) {
      console.log('saveAt error')
      console.log(err)
    }
  })
}

const getUserInfo = async (code) => {
  let result = {}
  const At = await getAt()
  await new Promise((resolve, reject) => {
    https.get(`https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${At}&code=${code}`, res => {
      res.on('data', (data) => {
        resolve(JSON.parse(data.toString()))
      })
    })
  }).then((data) => {
    result = data
  })
  return result
}

const getLocalJtInfo = async () => {
  let AtExpired = true
  let Jt = ''
  await new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/JT.json`, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  }).then((data) => {
    if (Date.now() < data.lastTime + data.expires_in * 1000) {
      AtExpired = false
      Jt = data.ticket
    }
  }).catch((err) => {
    console.log('something error')
    console.log(err)
  })
  return { AtExpired , Jt }
}

const getJt = async (ctx) => {
  const info = await getLocalJtInfo()
  let Jt = ''
  if (info.AtExpired) {
    console.log('I get a new Jt')
    const At = await getAt()
    await new Promise((resolve, reject) => {
      https.get(`https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${At}`, res => {
        res.on('data', (data) => {
          resolve(JSON.parse(data.toString()))
        })
      })
    }).then((data) => {
      console.log(data)
      if (data.errcode === 0) {
        saveJt(data)
        Jt = data.ticket
      }
    })
  } else {
    Jt = info.Jt
  }

  return Jt
}

const saveJt = async (data) => {
  data.lastTime = Date.now()
  fs.writeFile(`${__dirname}/JT.json`, JSON.stringify(data), 'utf8', (err, data) => {
    if (err) {
      console.log('saveJt error')
      console.log(err)
    }
  })
}

const getNoncestr = () => {
  const str = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  const arr = []
  for (let i = 0; i < 16; i++) {
    const num = Math.floor(Math.random() * 62)
    arr.push(str.slice(num, num + 1))
  }
  return arr.join('')
}

// 获取签名算法的数据
const getSnConfig = async (url) => {
  const noncestr = getNoncestr()
  const jsapi_ticket = await getJt()
  const timestamp = Math.floor(Date.now())
  const signature = sha1(`jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`)
  console.log(noncestr)
  console.log(jsapi_ticket)
  console.log(timestamp)
  console.log(signature)
  return {
    noncestr,
    timestamp,
    signature
  }
}

// const defineMenu = async () => {
//   const At = await getAt()
//   let str = ''
//   const button = [{
//     type: 'view',
//     name: '课表评价',
//     url: 'http://tianfer.top/comment'
//   }]
//   const postData = JSON.stringify({ button })
//   console.log('postData: ', postData)
//   await new Promise((resolve, reject) => {
//     const req = https.request(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${At}`, (res) => {
//       res.setEncoding('utf8')
//       res.on('data', (chunk) => {
//         resolve(chunk.toString())
//         console.log('data => ', Date.now())
//       })
//       res.on('end', () => {
//         console.log('end =>', Date.now())
//       })
//       res.on('error', (err) => {
//         reject(err)
//       })
//     })

//     req.write(postData)
//     req.end()
//   }).then((data) => {
//     str = data
//   }).catch((err) => {
//     console.log('request error')
//     console.log(err)
//   })

//   return str
// }

// const dealMsg = (ctx) => {
//   if (loadSucs(ctx)) {
//     const msg = formatXml(ctx.request.body.xml)
//     if (msg.MsgType === 'text') {
//       ctx.status = 200
//       ctx.type = 'application/xml'
//       ctx.body = `<xml>
//                     <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
//                     <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
//                     <CreateTime>${Date.now()}</CreateTime>
//                     <MsgType><![CDATA[text]]></MsgType>
//                     <Content><![CDATA[http://tianfer.top/view]]></Content>
//                   </xml>`
//     }
//     if (msg.MsgType === 'event') {
//       if (msg.Event === 'subscribe') {
//         ctx.status = 200
//         ctx.type = 'application/xml'
//         ctx.body = `<xml>
//                      <ToUserName><![CDATA[${msg.FromUserName}]]></ToUserName>
//                      <FromUserName><![CDATA[${msg.ToUserName}]]></FromUserName>
//                      <CreateTime>${Date.now()}</CreateTime>
//                      <MsgType><![CDATA[text]]></MsgType>
//                      <Content><![CDATA[有基友开我裤链！(流金呦卡唔酷裂！)]]></Content>
//                    </xml>`
//       }
//     }
//   }
// }

// const formatXml = (target) => {
//   const msg = {}
//   if (typeof target === 'object') {
//     const arr = Object.entries(target)
//     for (const [key, val] of arr) {
//       if (val.length === 1) {
//         if (typeof val[0] === 'object') {
//           msg[key] = formatXml(val[0])
//         } else {
//           msg[key] = (val[0] || '').trim()
//         }
//       } else {
//         msg[key] = []

//         for(let i = 0, l = val.length; i < l; i++) {
//           msg[key].push(formatXml(val[i]))
//         }
//       }
//     }
//   }
//   return msg
// }

// const loadSucs = (ctx) => {
//   const signature = ctx.query.signature
//   const timestamp = ctx.query.timestamp
//   const nonce = ctx.query.nonce
//   const echostr = ctx.query.echostr
//   const token = config.token

//   const str = [timestamp, nonce, token].sort().join('')
//   const sha = sha1(str)
//   if (sha === signature) {
//     return true
//   }
//   return false
// }

// const checkout = (ctx) => {
//   ctx.body = loadSucs(ctx) ? ctx.query.echostr : 'error'
// }

const getType = (target) => {
  return Object.prototype.toString.call(target)
}

const isParamsOk = (params, formatObj, type) => {
  const res = {}
  if (!type || getType(params) === type) {
    for (let [key, valType] of Object.entries(formatObj)) {
      if (!params[key]) {
        res.code = 2
        res.msg = `请传递${key}的值`
        return res
      }
      if (valType === '[object Number]') {
        if (Number.isNaN(+params[key])) {
          res.code = 3
          console.log(key, params[key], typeof params[key])
          res.msg = `${key}值的类型不对`
          return res
        } else {
          params[key] = +params[key]
        }
      }
    }
    return {
      code: 0,
      data: params
    }
  } else {
    res.code = 1
    res.msg = '传递的值需为json'
    return res
  }
}

module.exports = {
  getAt,
  getUserInfo,
  isParamsOk,
  getSnConfig
}