const { Enrollment, User, Lesson } = require('../../models')
const { ifTimeEqual, timeFormater } = require('../../helpers/date-helpers')
const enrollmentController = {
  createEnroll: (req, res, next) => {
    Promise.all([
      User.findByPk(req.user.id),
      Lesson.findByPk(req.params.lessonId),
      Enrollment.findAll({ where: { lessonId: req.params.lessonId }, raw: true })
    ])
      .then(([user, lesson, enrollments]) => {
        if (!user) throw Error('您的帳號不存在，無法進行預約功能')
        if (!lesson) throw Error('該課程不存在，無法進行預約功能')
        if (enrollments) {
          enrollments.forEach(en => {
            if (ifTimeEqual(en.time, req.body.avaiTime)) {
              throw Error('該時段已被預約')
            }
          })
        }
        return Enrollment.create({
          studentId: user.id,
          lessonId: lesson.id,
          time: req.body.avaiTime
        })
      })
      .then((enrollment) => {
        Enrollment.findByPk(enrollment.id, { include: [{ model: Lesson, include: User }], raw: true, nest: true })
          .then((enrollment) => {
            if (enrollment) {
              enrollment.time = timeFormater(enrollment.time, enrollment.Lesson.timePerClass)
              res.render('popup', { enrollment, lessonId: req.params.lessonId })
            } else {
              res.render('popup', { lessonId: req.params.lessonId })
            }
          })
      })
      .catch(err => next(err))
  }
}

module.exports = enrollmentController
