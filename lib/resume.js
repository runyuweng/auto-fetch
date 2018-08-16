const axios = require('axios')
const sendMail = require('./mail');
const get = require('get-value')
const { Authorization, Cookie } = require('./config')

function Resume() {
  this.totalCount = 0
}
Resume.prototype.fetchResume = function() {
  return axios.request({
    method: 'post',
    url: 'https://easy.lagou.com/can/new/list.json',
    params: {
      can: true,
      stage: 'NEW',
      needQueryAmount: true
    },
    headers: {
      'Origin': 'https://easy.lagou.com',
      'Referer': 'https://easy.lagou.com/can/new/index.htm?can=true&stage=NEW&needQueryAmount=true',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      Authorization,
      Cookie,
    }
  })
}

Resume.prototype.verifyHasNewResume = function(data, callback) {
  const totalCount = get(data, 'content.data.totalCount') || 0;
  const rows = get(data, 'content.rows') || [];
  const newCount = totalCount - this.totalCount;

  console.log('in verifyHasNewResume', this.totalCount, totalCount)

  this.totalCount = totalCount;

  if (newCount === this.totalCount) {
    callback()
    return
  }

  for (let i=0; i<newCount; i++) {
    const positionName = rows[i].positionName || '';
    if (positionName.indexof('前端')>-1 && positionName.indexof('成都')>-1) {
      sendMail('收到一份成都前端简历')
    }
  }
  callback()
}

module.exports = Resume