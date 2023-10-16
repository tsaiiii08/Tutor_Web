const { Lesson, User, Enrollment } = require('../../models/index')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { datesInPeriod, allLessonTime, avaiLessonTime, timeFormater } = require('../../helpers/date-helpers')
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
        res.render('lessons', {
          lessons, keyword, pagination: getPagination(limit, page, lessonsAll.count)
        })
      })
      .catch(err => next(err))
  },
  getLesson: (req, res, next) => {
    Lesson.findByPk(req.params.id, { include: [User, { model: Enrollment, include: User }], nest: true, raw: false })
      .then((lesson) => {
        let noAvaiTime = false
        const lessonTime = allLessonTime(datesInPeriod(new Date(), lesson.availableDay), lesson.timePerClass)
        const enrollTime = []
        lesson.Enrollments.forEach((en) => {
          enrollTime.push(en.time)
        })
        const avaiTimeToRender = []
        const avaiTime = avaiLessonTime(lessonTime, enrollTime)
        avaiTime.forEach(time => {
          avaiTimeToRender.push({ time, formatTime: timeFormater(time, lesson.timePerClass) })
        })
        if (!avaiTime.length) {
          noAvaiTime = true
        }
        res.render('lesson', { lesson: lesson.toJSON(), noAvaiTime, avaiTime: avaiTimeToRender })
      })
      .catch(err => next(err))
  }
}

module.exports = lessonController
