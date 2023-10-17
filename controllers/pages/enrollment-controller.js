const { Enrollment, User, Lesson } = require('../../models')
const { ifTimeEqual } =require('../../helpers/date-helpers')
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
        console.log(enrollments)
        console.log(`${enrollments[0].time}   ${req.body.avaiTime}`)
        if (enrollments) {
          enrollments.forEach(en => {
            if (ifTimeEqual(en.time, req.body.avaiTime)) {
              throw Error('該時段已被預約')
            }
          })
        }
        Enrollment.create({
          studentId: user.id,
          lessonId: lesson.id,
          time: req.body.avaiTime
        })
          .then((enrollment) => {
            res.redirect(`/lesson/${req.params.lessonId}`)
          })
          .catch(err => next(err))
      })
  }
}

module.exports = enrollmentController
