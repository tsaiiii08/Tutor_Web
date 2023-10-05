const { getUser } = require('../../helpers/auth-helpers')
const lessonController = {
  getLessons: (req, res) => {
    const user = getUser(req)
    res.render('lessons', { user })
  }
}

module.exports = lessonController
