const { Lesson, User } = require('../../models/index')
const lessonController = {
  getLessons: (req, res) => {
    Lesson.findAll({ include: User, raw: true, nest: true })
      .then((lessons) => {
        lessons.forEach(lesson => {
          lesson.introduction = lesson.introduction?.substring(0, 20)
        })
        res.render('lessons', { lessons })
      })
  }
}

module.exports = lessonController
