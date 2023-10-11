const { Lesson, User } = require('../../models/index')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const lessonController = {
  getLessons: (req, res, next) => {
    const keyword = req.query.keyword || ''
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Lesson.findAndCountAll({ include: User, limit, offset, raw: true, nest: true })
      .then((lessonsAll) => {
        const lessons = lessonsAll.rows.filter((lesson) =>
          lesson.name.toLowerCase().includes(keyword.toLowerCase()) || lesson.User.name.toLowerCase().includes(keyword.toLowerCase())
        )
        lessons.forEach(lesson => {
          lesson.introduction = lesson.introduction?.substring(0, 20)
        })
        console.log(getPagination(limit, page, lessons.length))
        res.render('lessons', {
          lessons, keyword, pagination: getPagination(limit, page, lessonsAll.count)
      })
      })
      .catch(err => next(err))
  }
}

module.exports = lessonController
