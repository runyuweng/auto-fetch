const Resume = require('./resume');
const sendMail = require('./mail');

const resume = new Resume()

let errTimes = 0

function start() {
  setTimeout(() => {
    resume.fetchResume().then(function (res) {
      try {
        const result = JSON.parse(JSON.stringify(res.data))
        resume.verifyHasNewResume(result, start)
      } catch (err) {
        console.log(`拉勾登录失效 errTimes:${errTimes} err:`, err)
        errTimes++;
        if (errTimes >= 3) {
          sendMail('拉勾登录失效')
          return
        }
        start()
      }
    })
  }, 20 * 1000)
}

start()