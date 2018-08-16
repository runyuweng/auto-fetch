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

  if (!totalCount) {
    callback()
    return
  }

  const rows = get(data, 'content.rows') || [];
  const newCount = totalCount - this.totalCount;

  console.log(`in verifyHasNewResume, oldCount: ${this.totalCount}, newCount: ${totalCount}`)
  this.totalCount = totalCount;

  if (newCount === this.totalCount) {
    callback()
    return
  }

  for (let i=0; i<newCount; i++) {
    if (i >= rows.length) {
      break
    }
    const positionName = rows[i].positionName || '';
    const candidateName = rows[i].candidateName || '';
    if (positionName.indexOf('前端')>-1 && positionName.indexOf('成都')>-1) {
      sendMail(`收到一份成都前端简历 投递岗位：${positionName}, 投递人：${candidateName}`)
      continue
    }
    if (positionName.indexOf('前端')>-1) {
      sendMail(`收到一份前端简历 投递岗位：${positionName}, 投递人：${candidateName}`)
      continue
    }
  }
  callback()
}

module.exports = Resume