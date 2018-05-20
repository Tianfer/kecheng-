const http = require('http')

const options = {
  hostname: 'kdjw.hnust.cn',
  port: 80,
  path: '/kdjw/jiaowu/pkgl/llsykb/llsykb_kb.jsp',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36',
    'Connection': 'keep-alive'
  }
}

http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应中已无数据。');
  });
})